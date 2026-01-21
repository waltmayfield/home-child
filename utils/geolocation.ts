export async function getCurrentPosition(options?: { timeoutMs?: number }) {
  const timeoutMs = options?.timeoutMs ?? 8000;
  return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator?.geolocation) {
      return reject(new Error('Geolocation not available'));
    }

    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      reject(new Error('Geolocation timeout'));
    }, timeoutMs);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (timedOut) return;
        clearTimeout(timer);
        resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      (err) => {
        if (timedOut) return;
        clearTimeout(timer);
        reject(err);
      },
      { enableHighAccuracy: true, maximumAge: 60_000 }
    );
  });
}
