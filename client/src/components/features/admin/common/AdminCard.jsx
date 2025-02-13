const AdminCard = ({ title, children, className = '' }) => {
  return (
    <div className={`card bg-base-100 shadow-xl ${className}`}>
      {title && (
        <div className="card-title p-4 border-b">
          {title}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  )
}

export default AdminCard
