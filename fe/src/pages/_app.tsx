import type { AppProps, NextWebVitalsMetric } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

// Hàm reportWebVitals nhanh gọn
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // Gửi metric chỉ khi có window (client-side)
  if (typeof window !== 'undefined') {
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric_name: metric.name,
        value: metric.value,
        page_path: window.location.pathname || '/', // fix null
      }),
    }).catch(() => {})
  }
}

export default MyApp
