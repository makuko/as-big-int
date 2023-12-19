// @ts-ignore: decorator
@inline
export const __BITS: u8 = 64;

// @ts-ignore: decorator
@inline
export const __HALF_BITS: u8 = 32;

// @ts-ignore: decorator
@inline
export const __WORD_MASK = u64.MAX_VALUE;

// @ts-ignore: decorator
@inline
export const __HALF_WORD_MASK = u32.MAX_VALUE;

// @ts-ignore: decorator
@inline
export const __HALF_RADIX: u64 = 1 << __HALF_BITS;
