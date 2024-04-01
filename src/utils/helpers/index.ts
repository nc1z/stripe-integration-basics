export const createJsonResponse = ({
    success = true,
    data = null,
    error = null,
}: {
    success?: boolean
    data?: any
    error?: string | null
}) => ({ success, data, error })
