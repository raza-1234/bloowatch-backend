const paging = (page, limit, data, totalCount) => {
  const totalPage = Math.ceil(totalCount/limit)
  const pagingInfo = {
    data,
    paging: {
      totalCount: totalCount,
      currentDataCount: data.length, 
      currentPage: page,
      totalPage: totalPage, 
      limit: limit,
      moreData: page < totalPage? true: false, 
      nextPage: page < totalPage ? ++page : null
    }
  }
  return pagingInfo
}

module.exports = paging