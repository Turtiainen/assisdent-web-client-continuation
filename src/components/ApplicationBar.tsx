export const ApplicationBar = () => {
  return (
    <div className={`toolbar bg-white border-b-2 border-ad-blue-600 flex justify-between px-4`}>
      <div className={`page-actions`}>
        <span>⬅️</span>
        <span>➡️</span>
      </div>
      <div className="current-page">Kotisivu</div>
      <div className="windows-actions">
        <span>❔</span>
      </div>
    </div>
  )
}
