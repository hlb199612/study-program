// 引入mockjs
const Mock = require("mockjs");

// 获取 mock.Random 对象
const Random = Mock.Random;

import * as tools from "@/api/_tools.js";

export default ({ service, mock, serviceForMock }) => ({
  api: {
    getBannerList(params = {}) {
      let indexBannerList = [];
      // 生成 type=301 商城首页头部轮播图数据
      for (let i = 0; i < 5; i++) {
        let photoId = Random.natural(0, 85);
        let newIndexBannerListObject;
        newIndexBannerListObject = {
          image: {
            url: `https://picsum.photos/id/${photoId}/375/150`
          },
          url: Random.url(),
          type: 301,
          seq: i
        };
        indexBannerList.push(newIndexBannerListObject);
      }
      // 生成 type=302 商城首页中部轮播图数据
      let indexSwipeList = [];
      for (let i = 0; i < 5; i++) {
        let photoId = Random.natural(0, 85);
        let newIndexSwipeListObject;
        newIndexSwipeListObject = {
          image: {
            url: `https://picsum.photos/id/${photoId}/170/180`
          },
          url: Random.url(),
          type: 302,
          seq: i
        };
        indexSwipeList.push(newIndexSwipeListObject);
      }
      // 模拟数据
      mock
        .onAny("/shopapi/banner/list", { params: { type: 301 } })
        .reply(config => tools.responseSuccess(indexBannerList));
      mock
        .onAny("/shopapi/banner/list", { params: { type: 302 } })
        .reply(config => tools.responseSuccess(indexSwipeList));
      // 接口请求
      return serviceForMock({
        url: "/shopapi/banner/list",
        method: "get",
        params
      });
    },

    getReportList(params = {}) {
      let indexReportList = [];
      for (let i = 0; i < 5; i++) {
        let newIndexReportListObject = {
          title: Random.ctitle(5, 12),
          url: Random.url()
        };
        indexReportList.push(newIndexReportListObject);
      }
      // 模拟数据
      mock
        .onAny("/shopapi/report/list")
        .reply(config => tools.responseSuccess(indexReportList));
      // 接口请求
      return serviceForMock({
        url: "/shopapi/report/list",
        method: "get",
        params
      });
    }
  }
});
