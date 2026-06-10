'use client';

import {Component, forwardRef, useCallback, useEffect, useMemo, useRef, useState, type ComponentType, type CSSProperties, type ReactNode, type RefAttributes} from 'react';
import {ChevronLeftIcon, ChevronRightIcon, CollapseIcon, DownloadIcon, ExpandIcon, ExternalIcon} from './Icons';

type BusinessDevelopmentPdfViewerProps = {
  pdfUrl: string;
  title?: string;
  description?: string;
  downloadLabel?: string;
  filename?: string;
};

type PdfViewport = {
  width: number;
  height: number;
};

type PdfPage = {
  getViewport: (options: {scale: number}) => PdfViewport;
  render: (options: {canvasContext: CanvasRenderingContext2D; viewport: PdfViewport}) => {
    cancel: () => void;
    promise: Promise<unknown>;
  };
};

type PdfDocument = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPage>;
  destroy?: () => Promise<void>;
};

type FlipBookEvent = {
  data?: number | string;
};

type FlipBookState = 'user_fold' | 'fold_corner' | 'flipping' | 'read';

type FlipBookRef = {
  pageFlip?: () => {
    flipNext?: (corner?: 'top' | 'bottom') => void;
    flipPrev?: (corner?: 'top' | 'bottom') => void;
  };
};

type FlipBookProps = {
  children: ReactNode;
  className: string;
  style: CSSProperties;
  width: number;
  height: number;
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
  size: 'fixed' | 'stretch';
  startPage: number;
  showCover: boolean;
  usePortrait: boolean;
  drawShadow: boolean;
  flippingTime: number;
  maxShadowOpacity: number;
  mobileScrollSupport: boolean;
  useMouseEvents: boolean;
  clickEventForward: boolean;
  showPageCorners: boolean;
  disableFlipByClick: boolean;
  autoSize: boolean;
  startZIndex: number;
  swipeDistance: number;
  renderOnlyPageLengthChange: boolean;
  onFlip: (event: FlipBookEvent) => void;
  onChangeState: (event: FlipBookEvent) => void;
  onInit: () => void;
  onUpdate: () => void;
};

type FlipBookComponent = ComponentType<FlipBookProps & RefAttributes<FlipBookRef>>;

type FlipbookErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  onError: () => void;
};

type FlipbookErrorBoundaryState = {
  hasError: boolean;
};

const MIN_ZOOM = 0.7;
const MAX_ZOOM = 2.35;
const FULLSCREEN_MAX_ZOOM = 3.25;
const ZOOM_STEP = 0.25;
const DEFAULT_PAGE_SIZE = {
  width: 842,
  height: 595,
};
const SPREAD_GUTTER = 14;
const DESKTOP_STAGE_INSET = 36;
const MOBILE_STAGE_INSET = 20;
const LAYOUT_SETTLE_TIME = 180;

class FlipbookErrorBoundary extends Component<FlipbookErrorBoundaryProps, FlipbookErrorBoundaryState> {
  state: FlipbookErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {hasError: true};
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

const FlipbookPage = forwardRef<HTMLDivElement, {pageNumber: number; title?: string; setCanvasRef: (pageNumber: number, node: HTMLCanvasElement | null) => void}>(
  ({pageNumber, title, setCanvasRef}, ref) => (
    <div
      className={[
        'business-pdf-page',
        pageNumber === 1 ? 'business-pdf-page-cover' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      ref={ref}
    >
      <canvas
        ref={(node) => setCanvasRef(pageNumber, node)}
        aria-label={`${title || 'Business Development PDF'} page ${pageNumber}`}
      />
    </div>
  )
);

FlipbookPage.displayName = 'FlipbookPage';

export default function BusinessDevelopmentPdfViewer({
  pdfUrl,
  title,
  description,
  downloadLabel = 'Download PDF',
  filename,
}: BusinessDevelopmentPdfViewerProps) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const canvasShellRef = useRef<HTMLDivElement | null>(null);
  const canvasRefs = useRef<Record<number, HTMLCanvasElement | null>>({});
  const flipBookRef = useRef<FlipBookRef | null>(null);
  const documentRef = useRef<PdfDocument | null>(null);
  const isFlippingRef = useRef(false);
  const pendingLayoutRef = useRef<{width: number; height: number} | null>(null);
  const pendingFullscreenLayoutRef = useRef<boolean | null>(null);
  const layoutTimeoutRef = useRef<number | null>(null);
  const [FlipBookComponent, setFlipBookComponent] = useState<FlipBookComponent | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [layoutBounds, setLayoutBounds] = useState({width: 0, height: 720});
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [initializedFlipbookKey, setInitializedFlipbookKey] = useState<string | null>(null);
  const [readyAnimatedRenderKey, setReadyAnimatedRenderKey] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turnDirection, setTurnDirection] = useState<'previous' | 'next' | null>(null);
  const [flipbookUnavailable, setFlipbookUnavailable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFullscreenLayout, setIsFullscreenLayout] = useState(false);

  const containerWidth = layoutBounds.width;
  const viewportHeight = layoutBounds.height;
  const isSpreadCapable = containerWidth >= 760;
  const downloadFilename = filename || 'animae-caribe-business-development.pdf';
  const downloadUrl = `/api/pdf-download?url=${encodeURIComponent(pdfUrl)}&filename=${encodeURIComponent(downloadFilename)}`;
  const pageNumbers = useMemo(() => Array.from({length: pageCount}, (_, index) => index + 1), [pageCount]);
  const setCanvasRef = useCallback((canvasPageNumber: number, node: HTMLCanvasElement | null) => {
    canvasRefs.current[canvasPageNumber] = node;
  }, []);
  const flipbookPages = useMemo(
    () =>
      pageNumbers.map((bookPageNumber) => (
        <FlipbookPage
          key={bookPageNumber}
          pageNumber={bookPageNumber}
          title={title}
          setCanvasRef={setCanvasRef}
        />
      )),
    [pageNumbers, setCanvasRef, title]
  );
  const canUseAnimatedFlipbook = Boolean(FlipBookComponent && !flipbookUnavailable && pageCount > 0 && isSpreadCapable);
  const maxZoom = isFullscreen ? FULLSCREEN_MAX_ZOOM : MAX_ZOOM;
  const zoomPercent = Math.round(zoom * 100);
  const pageAspectRatio = pageSize.width / pageSize.height;

  const flipbookSize = useMemo(() => {
    const stageWidth = Math.max(320, containerWidth || DEFAULT_PAGE_SIZE.width);
    const stageInset = isSpreadCapable ? DESKTOP_STAGE_INSET : MOBILE_STAGE_INSET;
    const availableWidth = Math.max(260, stageWidth - stageInset);
    const pageWidthFromStage = isSpreadCapable ? (availableWidth - SPREAD_GUTTER) / 2 : availableWidth;
    const maxPageHeight = isFullscreenLayout ? Math.max(360, viewportHeight - 86) : Math.max(420, viewportHeight * 0.88);
    const pageWidthFromHeight = maxPageHeight * pageAspectRatio;
    const pageWidth = Math.max(240, Math.floor(Math.min(pageWidthFromStage, pageWidthFromHeight)));
    const pageHeight = Math.max(180, Math.round(pageWidth / pageAspectRatio));

    return {
      bookWidth: isSpreadCapable ? pageWidth * 2 : pageWidth,
      pageWidth,
      pageHeight,
    };
  }, [containerWidth, isFullscreenLayout, isSpreadCapable, pageAspectRatio, viewportHeight]);

  const renderedFlipbookSize = useMemo(() => {
    const pageWidth = Math.max(168, Math.round(flipbookSize.pageWidth * zoom));
    const pageHeight = Math.max(126, Math.round(flipbookSize.pageHeight * zoom));

    return {
      bookWidth: isSpreadCapable ? pageWidth * 2 : pageWidth,
      pageWidth,
      pageHeight,
    };
  }, [flipbookSize.pageHeight, flipbookSize.pageWidth, isSpreadCapable, zoom]);
  const animatedRenderKey = `${pageCount}-${renderedFlipbookSize.pageWidth}x${renderedFlipbookSize.pageHeight}`;
  const flipbookInstanceKey = `${isSpreadCapable ? 'spread' : 'portrait'}-${animatedRenderKey}`;
  const isAnimatedFlipbookInitialized = initializedFlipbookKey === flipbookInstanceKey;
  const areAnimatedPagesReady = readyAnimatedRenderKey === animatedRenderKey;
  const isClosedFrontCover = canUseAnimatedFlipbook && pageNumber === 1;
  const isClosedBackCover = canUseAnimatedFlipbook && pageNumber === pageCount;
  const isClosedCover = isClosedFrontCover || isClosedBackCover;

  const visiblePages = useMemo(() => {
    if (!pageCount) {
      return [];
    }

    if (!isSpreadCapable || pageNumber === 1 || (pageNumber === pageCount && pageCount % 2 === 0)) {
      return [pageNumber];
    }

    return [pageNumber, Math.min(pageNumber + 1, pageCount)];
  }, [isSpreadCapable, pageCount, pageNumber]);

  const pageIndicator = useMemo(() => {
    if (!pageCount) {
      return 'Page 0 of 0';
    }

    if (visiblePages.length === 2) {
      return `Pages ${visiblePages[0]}-${visiblePages[1]} of ${pageCount}`;
    }

    return `Page ${visiblePages[0] || pageNumber} of ${pageCount}`;
  }, [pageCount, pageNumber, visiblePages]);
  const pagesToRender = useMemo(
    () => (canUseAnimatedFlipbook ? pageNumbers : visiblePages),
    [canUseAnimatedFlipbook, pageNumbers, visiblePages]
  );

  const commitLayout = useCallback((nextLayout: {width: number; height: number}) => {
    if (isFlippingRef.current) {
      pendingLayoutRef.current = nextLayout;
      return;
    }

    setLayoutBounds((current) =>
      current.width === nextLayout.width && current.height === nextLayout.height ? current : nextLayout
    );
  }, []);

  const scheduleLayoutCommit = useCallback((width: number, height: number) => {
    pendingLayoutRef.current = {
      width: Math.round(width),
      height: Math.round(height),
    };

    if (layoutTimeoutRef.current !== null) {
      window.clearTimeout(layoutTimeoutRef.current);
    }

    layoutTimeoutRef.current = window.setTimeout(() => {
      layoutTimeoutRef.current = null;
      const pendingLayout = pendingLayoutRef.current;
      pendingLayoutRef.current = null;

      if (pendingLayout) {
        commitLayout(pendingLayout);
      }

      if (!isFlippingRef.current && pendingFullscreenLayoutRef.current !== null) {
        setIsFullscreenLayout(pendingFullscreenLayoutRef.current);
        pendingFullscreenLayoutRef.current = null;
      }
    }, LAYOUT_SETTLE_TIME);
  }, [commitLayout]);

  useEffect(() => {
    const shell = canvasShellRef.current;

    if (!shell) {
      return;
    }

    const measure = (width = shell.clientWidth) => {
      scheduleLayoutCommit(width, window.innerHeight || 720);
    };
    const observer = new ResizeObserver(([entry]) => measure(entry.contentRect.width));
    const handleWindowResize = () => measure();

    observer.observe(shell);
    measure();
    window.addEventListener('resize', handleWindowResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleWindowResize);
      if (layoutTimeoutRef.current !== null) {
        window.clearTimeout(layoutTimeoutRef.current);
      }
    };
  }, [scheduleLayoutCommit]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const nextIsFullscreen = document.fullscreenElement === shellRef.current;

      setIsFullscreen(nextIsFullscreen);
      pendingFullscreenLayoutRef.current = nextIsFullscreen;
      scheduleLayoutCommit(canvasShellRef.current?.clientWidth || window.innerWidth, window.innerHeight || 720);

      if (!nextIsFullscreen) {
        setZoom((current) => Math.min(current, MAX_ZOOM));
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [scheduleLayoutCommit]);

  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      setIsLoading(true);
      setError(null);

      try {
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();

        const loadingTask = pdfjs.getDocument({url: pdfUrl});
        const pdfDocument = (await loadingTask.promise) as unknown as PdfDocument;

        if (cancelled) {
          await pdfDocument.destroy?.();
          return;
        }

        documentRef.current = pdfDocument;
        setPageCount(pdfDocument.numPages);
        canvasRefs.current = {};
        setPageNumber(1);
        setReadyAnimatedRenderKey(null);

        const firstPage = await pdfDocument.getPage(1);

        if (!cancelled) {
          const firstPageViewport = firstPage.getViewport({scale: 1});
          setPageSize({
            width: firstPageViewport.width,
            height: firstPageViewport.height,
          });
        }
      } catch {
        if (!cancelled) {
          setError('The PDF could not be loaded. Please try the download instead.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      cancelled = true;
      const pdfDocument = documentRef.current;
      documentRef.current = null;
      if (pdfDocument?.destroy) {
        void pdfDocument.destroy();
      }
    };
  }, [pdfUrl]);

  useEffect(() => {
    let cancelled = false;

    async function loadFlipbook() {
      try {
        const pageFlipModule = await import('react-pageflip');

        if (!cancelled) {
          setFlipBookComponent(() => pageFlipModule.default as FlipBookComponent);
        }
      } catch {
        if (!cancelled) {
          setFlipbookUnavailable(true);
        }
      }
    }

    loadFlipbook();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const pdfDocument = documentRef.current;

    if (
      !pdfDocument ||
      !containerWidth ||
      !pagesToRender.length ||
      (canUseAnimatedFlipbook && !isAnimatedFlipbookInitialized)
    ) {
      return;
    }

    const activePdfDocument = pdfDocument;
    let cancelled = false;
    let readinessTimeout: number | null = null;
    const renderTasks: Array<{cancel: () => void; promise: Promise<unknown>}> = [];

    async function renderPage(pageToRender: number, onRenderStarted?: () => void) {
      const canvas = canvasRefs.current[pageToRender];

      if (!canvas) {
        return;
      }

      try {
        const page = await activePdfDocument.getPage(pageToRender);
        if (cancelled) {
          return;
        }

        const baseViewport = page.getViewport({scale: 1});
        const scale = canUseAnimatedFlipbook
          ? renderedFlipbookSize.pageWidth / baseViewport.width
          : Math.max(flipbookSize.pageWidth / baseViewport.width, 0.35) * zoom;
        const viewport = page.getViewport({scale});
        const context = canvas.getContext('2d');

        if (!context) {
          return;
        }

        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        context.clearRect(0, 0, viewport.width, viewport.height);

        const activeRenderTask = page.render({canvasContext: context, viewport});
        renderTasks.push(activeRenderTask);
        onRenderStarted?.();
        await activeRenderTask.promise;
      } catch (renderError) {
        if (!cancelled && (renderError as {name?: string})?.name !== 'RenderingCancelledException') {
          setError('This PDF page could not be rendered. Please try another page or download the PDF.');
        }
      }
    }

    setError(null);
    const currentPage = pageNumber;
    const orderedPages = canUseAnimatedFlipbook
      ? Array.from(
          new Set([
            currentPage,
            Math.min(pageCount, currentPage + 1),
            Math.max(1, currentPage - 1),
            ...pagesToRender,
          ])
        )
      : pagesToRender;

    void (async () => {
      for (const [index, pageToRender] of orderedPages.entries()) {
        if (cancelled) {
          return;
        }

        await renderPage(
          pageToRender,
          canUseAnimatedFlipbook && index === 0
            ? () => {
                readinessTimeout = window.setTimeout(() => {
                  if (!cancelled) {
                    setReadyAnimatedRenderKey(animatedRenderKey);
                  }
                }, 450);
              }
            : undefined
        );
      }
    })();

    return () => {
      cancelled = true;
      if (readinessTimeout !== null) {
        window.clearTimeout(readinessTimeout);
      }
      renderTasks.forEach((renderTask) => renderTask.cancel());
    };
  }, [animatedRenderKey, canUseAnimatedFlipbook, containerWidth, flipbookSize.pageWidth, isAnimatedFlipbookInitialized, pageCount, pageNumber, pagesToRender, renderedFlipbookSize.pageWidth, zoom]);

  useEffect(() => {
    if (!turnDirection) {
      return;
    }

    const timeout = window.setTimeout(() => setTurnDirection(null), 260);
    return () => window.clearTimeout(timeout);
  }, [turnDirection]);

  const canGoPrevious = pageNumber > 1;
  const canGoNext = pageNumber < pageCount;
  const canZoomOut = zoom > MIN_ZOOM;
  const canZoomIn = zoom < maxZoom;

  const goPrevious = () => {
    if (!canGoPrevious || isFlipping || (canUseAnimatedFlipbook && !areAnimatedPagesReady)) {
      return;
    }

    setTurnDirection('previous');

    if (canUseAnimatedFlipbook) {
      flipBookRef.current?.pageFlip?.()?.flipPrev?.('bottom');
      return;
    }

    setPageNumber((current) => {
      if (!isSpreadCapable) {
        return Math.max(1, current - 1);
      }

      if (current === pageCount && pageCount % 2 === 0) {
        return Math.max(2, pageCount - 2);
      }

      return current <= 2 ? 1 : Math.max(1, current - 2);
    });
  };

  const goNext = () => {
    if (!canGoNext || isFlipping || (canUseAnimatedFlipbook && !areAnimatedPagesReady)) {
      return;
    }

    setTurnDirection('next');

    if (canUseAnimatedFlipbook) {
      flipBookRef.current?.pageFlip?.()?.flipNext?.('bottom');
      return;
    }

    setPageNumber((current) => {
      if (!isSpreadCapable) {
        return Math.min(pageCount, current + 1);
      }

      if (current === 1) {
        return Math.min(2, pageCount);
      }

      if (pageCount % 2 === 0 && current + 2 >= pageCount) {
        return pageCount;
      }

      return Math.min(pageCount, current + 2);
    });
  };

  const toggleFullscreen = () => {
    const shell = shellRef.current;

    if (!shell) {
      return;
    }

    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
      return;
    }

    void shell.requestFullscreen().catch(() => undefined);
  };

  const handleFlip = (event: FlipBookEvent) => {
    const nextPage = Number(event.data);

    if (Number.isFinite(nextPage)) {
      setPageNumber(Math.min(pageCount || 1, Math.max(1, nextPage + 1)));
    }
  };

  const handleFlipbookInit = () => {
    setFlipbookUnavailable(false);
    setInitializedFlipbookKey(flipbookInstanceKey);
  };

  const handleFlipState = (event: FlipBookEvent) => {
    const nextState = event.data as FlipBookState;
    const nextIsFlipping = nextState === 'flipping';

    isFlippingRef.current = nextIsFlipping;
    setIsFlipping(nextIsFlipping);

    if (!nextIsFlipping && pendingLayoutRef.current && layoutTimeoutRef.current === null) {
      const pendingLayout = pendingLayoutRef.current;
      pendingLayoutRef.current = null;
      commitLayout(pendingLayout);
    }

    if (!nextIsFlipping && pendingFullscreenLayoutRef.current !== null) {
      setIsFullscreenLayout(pendingFullscreenLayoutRef.current);
      pendingFullscreenLayoutRef.current = null;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;

      if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement || activeElement instanceof HTMLSelectElement) {
        return;
      }

      if (event.key === 'Escape' && document.fullscreenElement === shellRef.current) {
        event.preventDefault();
        void document.exitFullscreen().catch(() => undefined);
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrevious();
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const stableBook = (
    <div
      className={[
        'business-pdf-book',
        visiblePages.length === 2 ? 'business-pdf-book-spread' : 'business-pdf-book-single',
        turnDirection ? `is-turning-${turnDirection}` : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-viewer-mode="stable"
    >
      {visiblePages.map((visiblePage, index) => (
        <figure
          className={[
            'business-pdf-page',
            index === 0 ? 'business-pdf-page-left' : 'business-pdf-page-right',
            visiblePage === 1 ? 'business-pdf-page-cover' : '',
            visiblePage === pageCount ? 'business-pdf-page-back-cover' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          key={visiblePage}
        >
          <canvas
            ref={(node) => setCanvasRef(visiblePage, node)}
            aria-label={`${title || 'Business Development PDF'} page ${visiblePage}`}
          />
        </figure>
      ))}
    </div>
  );

  const animatedBook =
    canUseAnimatedFlipbook && FlipBookComponent ? (
      <FlipbookErrorBoundary fallback={stableBook} onError={() => setFlipbookUnavailable(true)}>
        <div
          className={[
            'business-pdf-flipbook-shell',
            areAnimatedPagesReady ? 'is-ready' : 'is-preparing',
            isClosedFrontCover ? 'is-closed-front' : '',
            isClosedBackCover ? 'is-closed-back' : '',
            !isClosedCover ? 'is-open-spread' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={{
            width: `${isClosedCover ? renderedFlipbookSize.pageWidth : renderedFlipbookSize.bookWidth}px`,
            height: `${renderedFlipbookSize.pageHeight}px`,
          } as CSSProperties}
        >
          <div
            className="business-pdf-flipbook-positioner"
            style={{
              width: `${renderedFlipbookSize.bookWidth}px`,
              height: `${renderedFlipbookSize.pageHeight}px`,
            }}
          >
            <FlipBookComponent
              key={flipbookInstanceKey}
              ref={flipBookRef}
              className="business-pdf-flipbook"
              style={{width: `${renderedFlipbookSize.bookWidth}px`, height: `${renderedFlipbookSize.pageHeight}px`}}
              width={renderedFlipbookSize.pageWidth}
              height={renderedFlipbookSize.pageHeight}
              minWidth={renderedFlipbookSize.pageWidth}
              maxWidth={renderedFlipbookSize.pageWidth}
              minHeight={renderedFlipbookSize.pageHeight}
              maxHeight={renderedFlipbookSize.pageHeight}
              size="fixed"
              startPage={Math.max(0, pageNumber - 1)}
              showCover
              usePortrait={!isSpreadCapable}
              drawShadow
              flippingTime={820}
              maxShadowOpacity={0.32}
              mobileScrollSupport
              useMouseEvents
              clickEventForward
              showPageCorners
              disableFlipByClick={false}
              autoSize={false}
              startZIndex={0}
              swipeDistance={24}
              renderOnlyPageLengthChange
              onFlip={handleFlip}
              onChangeState={handleFlipState}
              onInit={handleFlipbookInit}
              onUpdate={() => undefined}
            >
              {flipbookPages}
            </FlipBookComponent>
          </div>
        </div>
      </FlipbookErrorBoundary>
    ) : (
      stableBook
    );

  return (
    <section className="business-pdf-section" aria-labelledby="business-pdf-heading">
      <div className="business-pdf-heading">
        <span className="section-kicker">PDF resource</span>
        <h2 id="business-pdf-heading">{title || 'Business Development PDF'}</h2>
        {description ? <p>{description}</p> : null}
      </div>

      <div className="business-pdf-viewer" ref={shellRef}>
        <div className="business-pdf-toolbar" aria-label="PDF controls">
          <span className="business-pdf-page-indicator">{pageIndicator}</span>
          <span className="business-pdf-zoom-indicator">{zoomPercent}%</span>
          <button
            type="button"
            onClick={() => setZoom((current) => Math.max(MIN_ZOOM, current - ZOOM_STEP))}
            disabled={!canZoomOut || isFlipping}
          >
            Zoom out
          </button>
          <button
            type="button"
            onClick={() => setZoom((current) => Math.min(maxZoom, current + ZOOM_STEP))}
            disabled={!canZoomIn || isFlipping}
          >
            Zoom in
          </button>
          <button type="button" onClick={toggleFullscreen} disabled={isFlipping}>
            {isFullscreen ? (
              <>
                <CollapseIcon /> Exit fullscreen
              </>
            ) : (
              <>
                <ExpandIcon /> Fullscreen
              </>
            )}
          </button>
          <a className="business-pdf-download" href={downloadUrl}>
            <DownloadIcon /> {downloadLabel}
          </a>
          <a className="business-pdf-open" href={pdfUrl} target="_blank" rel="noreferrer" aria-label="Open PDF in browser" title="Open PDF in browser">
            <ExternalIcon />
          </a>
        </div>

        <div
          className={[
            'business-pdf-canvas-shell',
            isFlipping ? 'is-flipping' : '',
            isClosedCover ? 'is-closed-cover' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          ref={canvasShellRef}
        >
          {isLoading ? <div className="business-pdf-state">Loading PDF...</div> : null}
          {!isLoading && canUseAnimatedFlipbook && !areAnimatedPagesReady ? (
            <div className="business-pdf-state">Preparing pages...</div>
          ) : null}
          {error ? (
            <div className="business-pdf-state business-pdf-error">
              <p>{error}</p>
              <a className="business-pdf-error-download" href={downloadUrl}>
                {downloadLabel}
              </a>
            </div>
          ) : null}
          <button
            className="business-pdf-side-arrow business-pdf-side-arrow-previous"
            type="button"
            aria-label="Previous PDF page"
            onClick={goPrevious}
            disabled={!canGoPrevious || isFlipping || (canUseAnimatedFlipbook && !areAnimatedPagesReady)}
          >
            <ChevronLeftIcon />
            <span aria-hidden="true">‹</span>
          </button>
          {animatedBook}
          <button
            className="business-pdf-side-arrow business-pdf-side-arrow-next"
            type="button"
            aria-label="Next PDF page"
            onClick={goNext}
            disabled={!canGoNext || isFlipping || (canUseAnimatedFlipbook && !areAnimatedPagesReady)}
          >
            <ChevronRightIcon />
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </section>
  );
}
