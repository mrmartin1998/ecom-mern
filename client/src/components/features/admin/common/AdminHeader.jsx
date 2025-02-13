const AdminHeader = ({ title, children }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="flex gap-2">
        {children}
      </div>
    </div>
  )
}

export default AdminHeader
