export const APP_TABS = ['explore', 'predictor', 'compare', 'trends'] as const;

export type AppTab = (typeof APP_TABS)[number];
