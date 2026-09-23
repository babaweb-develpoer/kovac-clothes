/**
 * Some Chromium builds throw on Web Animations API keyframe offsets that
 * framer-motion generates internally for its hardware-accelerated
 * ("independent transform") mount-time animations — e.g.
 * "Offsets must be monotonically non-decreasing" or "Offsets must be null
 * or in the range [0,1]" — even though the keyframes are logically valid.
 * This has been observed to blank the entire page, since the exception is
 * thrown outside React's render/commit cycle and can't be caught by an
 * error boundary.
 *
 * We patch Element.animate to retry with offsets stripped (letting the
 * browser auto-space keyframes, which is always valid) and, failing that,
 * fall back to a no-op animation so callers always get a usable
 * Animation object instead of an uncaught exception.
 */
function stripOffsets(keyframes: unknown): unknown {
  if (Array.isArray(keyframes)) {
    return keyframes.map((kf) => {
      if (kf && typeof kf === "object" && "offset" in kf) {
        const { offset: _offset, ...rest } = kf as Record<string, unknown>;
        return rest;
      }
      return kf;
    });
  }
  if (keyframes && typeof keyframes === "object" && "offset" in keyframes) {
    const { offset: _offset, ...rest } = keyframes as Record<string, unknown>;
    return rest;
  }
  return keyframes;
}

export function patchElementAnimate() {
  if (typeof Element === "undefined" || !Element.prototype.animate) return;
  const nativeAnimate = Element.prototype.animate;
  if ((nativeAnimate as { __patched?: boolean }).__patched) return;

  function patchedAnimate(
    this: Element,
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | KeyframeAnimationOptions
  ): Animation {
    try {
      return nativeAnimate.call(this, keyframes, options);
    } catch (err) {
      if (!(err instanceof TypeError) || !/offset/i.test(err.message)) {
        throw err;
      }
      try {
        return nativeAnimate.call(this, stripOffsets(keyframes) as Keyframe[], options);
      } catch {
        return nativeAnimate.call(this, [], options);
      }
    }
  }
  (patchedAnimate as { __patched?: boolean }).__patched = true;
  Element.prototype.animate = patchedAnimate;
}
