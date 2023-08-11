/**
 * T -> a... | Ra...
 */
export function FirstVT() {}

/**
 * T -> ...a | ...aR
 */
export function LastVT() {}

/**
 * G文法中不存在 A->...BC... 的文法，且不含空串
 *
 * a = b: A->...ab... 或 A->...aBb...
 *
 * a < b: A->...aB..., B->b... 或 B->Cb...
 *
 * a > b: A->...Bb..., B->...a 或 B->...aC
 */
export function createSymbolPriorityTable() {}
