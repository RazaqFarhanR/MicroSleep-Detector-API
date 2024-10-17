const getResponse = (req, res, data, msg, code = 200) => res.status(code).send({
    status: true,
    message: msg,
    data,
});

const paginationResponse = (req, res, data, page, limit, count, totalPages, code = 200) => res.status(code).send({
    status: true,
    message: "successful",
    data: data,
    pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: count,
        totalPages: totalPages
    }
});
  
const addResponse = (req, res, data, msg, code = 201) => res.status(code).send({
    status: true,
    message: msg,
    data,
});

const editResponse = (req, res, data, code = 200) => res.status(code).send({
    status: true,
    message: "updated successfully",
    data,
});
  
const deleteResponse = (req, res, data, code = 200) => res.status(code).send({
    status: true,
    message: data + " data has been deleted",
    data,
});
  
const errorResponse = (
    req,
    res,
    message,
    code = 500,
) => res.status(code).json({
    message: message || 'Something went wrong'
});

module.exports = {
    getResponse,
    paginationResponse,
    addResponse,
    editResponse,
    deleteResponse,
    errorResponse
};