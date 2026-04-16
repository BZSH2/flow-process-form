import { Button, Input, Popconfirm, Space, Table, message } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  deleteCustomFormApi,
  getCustomFormsApi,
  type CustomFormDetail,
} from '@/api'

function formatDateTime(value: string) {
  if (!value) {
    return '--'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString('zh-CN', { hour12: false })
}

export default function PromotionForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [keywordInput, setKeywordInput] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    keyword: '',
  })
  const [dataSource, setDataSource] = useState<CustomFormDetail[]>([])

  const loadList = useCallback(async () => {
    try {
      setLoading(true)
      const result = await getCustomFormsApi({
        page: pagination.current,
        pageSize: pagination.pageSize,
        keyword: pagination.keyword || undefined,
      })

      setDataSource(result.items)
      setPagination((prev) => ({
        ...prev,
        current: result.page,
        pageSize: result.pageSize,
        total: result.total,
      }))
    } finally {
      setLoading(false)
    }
  }, [pagination.current, pagination.keyword, pagination.pageSize])

  useEffect(() => {
    void loadList()
  }, [loadList])

  const onDelete = async (id: string) => {
    await deleteCustomFormApi(id)
    message.success('删除成功')

    const shouldBackPage = dataSource.length === 1 && pagination.current > 1
    if (shouldBackPage) {
      setPagination((prev) => ({
        ...prev,
        current: prev.current - 1,
      }))
      return
    }

    void loadList()
  }

  const handleSearch = (value: string) => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
      keyword: value.trim(),
    }))
  }

  const handleTableChange = (nextPagination: TablePaginationConfig) => {
    setPagination((prev) => ({
      ...prev,
      current: nextPagination.current || 1,
      pageSize: nextPagination.pageSize || prev.pageSize,
    }))
  }

  const columns: ColumnsType<CustomFormDetail> = [
    {
      title: '表单名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      minWidth: 220,
    },
    {
      title: '表单编码',
      dataIndex: 'code',
      key: 'code',
      width: 220,
    },
    {
      title: '字段数',
      key: 'fieldCount',
      width: 100,
      render: (_, record) => record.schema?.length || 0,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (value: string) => formatDateTime(value),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size={8}>
          <Button
            type="link"
            onClick={() => navigate(`/form/promotionCreate?id=${record.id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除该表单吗？"
            description="删除后不可恢复，请谨慎操作。"
            okText="删除"
            cancelText="取消"
            onConfirm={() => onDelete(record.id)}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="h-44px bg-white flex items-center justify-between px-12px mb-12px gap-12px">
        <Input.Search
          allowClear
          placeholder="按表单名称/编码搜索"
          className="max-w-320px"
          value={keywordInput}
          onChange={(event) => setKeywordInput(event.target.value)}
          onSearch={handleSearch}
        />
        <Button type="primary" onClick={() => navigate('/form/promotionCreate')}>
          新建
        </Button>
      </div>

      <div className="flex-1 min-h-0 bg-white p-12px overflow-hidden">
        <Table<CustomFormDetail>
          rowKey="id"
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: 960 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  )
}
