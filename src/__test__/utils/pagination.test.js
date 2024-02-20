const paging = require('../../utils/pagination');

describe('paging', () => {
  
  it('should return correct paging information', () => {
    const page = 1;
    const limit = 10;
    const data = [1, 2, 3, 4, 5];
    const totalCount = 20;

    const expectedPagingInfo = {
      data: data,
      paging: {
        totalCount: totalCount,
        currentDataCount: data.length,
        currentPage: page,
        totalPage: 2,
        limit: limit,
        moreData: true,
        nextPage: 2
      }
    };

    const result = paging(page, limit, data, totalCount);

    expect(result).toEqual(expectedPagingInfo);
  });

  it('should handle last page correctly', () => {
    const page = 2;
    const limit = 10;
    const data = [11, 12, 13];
    const totalCount = 13;

    const expectedPagingInfo = {
      data: data,
      paging: {
        totalCount: totalCount,
        currentDataCount: data.length,
        currentPage: page,
        totalPage: 2,
        limit: limit,
        moreData: false,
        nextPage: null
      }
    };
 
    const result = paging(page, limit, data, totalCount);

    expect(result).toEqual(expectedPagingInfo);
  });

});
