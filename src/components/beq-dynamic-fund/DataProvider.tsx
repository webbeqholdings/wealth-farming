import React, { createContext, useState, useContext, ReactNode } from 'react'

// Định nghĩa kiểu cho dữ liệu context
interface DataContextType {
  data: any // Bạn có thể thay 'any' bằng kiểu dữ liệu cụ thể nếu biết
  setData: React.Dispatch<React.SetStateAction<any>>
}

// Khởi tạo context với kiểu dữ liệu
const DataContext = createContext<DataContextType | undefined>(undefined)

// Tạo Provider component
interface DataProviderProps {
  children: ReactNode
}

export const DataDynamicFundProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [data, setData] = useState<any>({})

  return <DataContext.Provider value={{ data, setData }}>{children}</DataContext.Provider>
}

// Custom hook để sử dụng context
export const useDynamicFundData = (): DataContextType => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
