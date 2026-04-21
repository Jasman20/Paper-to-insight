import { create } from 'zustand'

const useSurveyStore = create((set) => ({
  currentResult:  null,
  surveys:        [],
  stats:          null,
  isProcessing:   false,
  offlineCount:   0,

  setCurrentResult: (r) => set({ currentResult: r }),
  setSurveys:       (s) => set({ surveys: s }),
  setStats:         (s) => set({ stats: s }),
  setIsProcessing:  (v) => set({ isProcessing: v }),
  setOfflineCount:  (n) => set({ offlineCount: n }),
}))

export default useSurveyStore
