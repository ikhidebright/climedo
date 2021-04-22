import { Tabs } from "../models/tabs";
import createError from "http-errors";
import { tabsSchema } from "../helpers/validateForm";

import client from "../config/client";
const { api } = client;

export default class TabsController {
  static async createTabs(request, response, next) {
    try {
      const result = await tabsSchema.validateAsync(request.body);
      const tabExists = await Tabs.findOne({ name: result.name });
      if (tabExists) {
        throw createError.BadRequest(
          `Tab name: ${result.name} is already used`
        );
      }
      let tab = new Tabs(result);
      let data = await tab.save();
      return response.status(200).json({
        success: true,
        message: "Tab created successfully",
        data,
      });
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) error.status = 400;
      next(error);
    }
  }
  static async getAll(request, response, next) {
    try {
      let { page } = request.query;
      page = !page || isNaN(page) ? 1 : Number(page);

      let nextPageUrl, prevPageUrl;

      page = page < 1 ? 1 : Number(page);
      let limit = 4;

      let count = await Tabs.countDocuments({});

      let totalPages = Math.ceil(count / limit);
      page = page > totalPages && totalPages != 0 ? totalPages : page;

      const data = await Tabs.find()
        .sort({ CreatedDate: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      // delete page query from url
      delete request.query.page;
      let hasNextpage = totalPages - page;
      // get next page number
      let nextPageNumber = Number(page) + 1;
      // get  page number
      let prevPageNumber = Number(page) - 1;
      // format next page url
      nextPageUrl =
        hasNextpage === 0 || totalPages === 0
          ? false
          : `${api}tabs?page=${nextPageNumber}`;
      // format prev page url
      prevPageUrl = page === 1 ? false : `${api}tabs?page=${prevPageNumber}`;
      // return response with investment, total pages, and current page
      response.status(200).json({
        success: true,
        data,
        totalPages: totalPages,
        currentPage: page,
        totalTabs: count,
        prevPageUrl: prevPageUrl,
        nextPageUrl: nextPageUrl,
      });
    } catch (error) {
      console.log(error);
      if (error.isJoi === true) error.status = 400;
      next(error);
    }
  }
  static async deleteTab(request, response, next) {
    try {
      const { tabId } = request.params;
      const tabExist = await Tabs.findOne({ _id: tabId });
      if (!tabExist) {
        throw createError.BadRequest(`Tab doesn't exist`);
      }
      await Tabs.deleteOne({ _id: tabId });
      return response.status(200).send("Tab deleted successfully");
    } catch (error) {
      next(error);
    }
  }
  static async editTab(request, response, next) {
    try {
      const { tabId } = request.params;
      const result = await tabsSchema.validateAsync(request.body);
      const tabExist = await Tabs.findOne({ _id: tabId });
      if (!tabExist) {
        throw createError.BadRequest(`Tab doesn't exist`);
      }
      const data = await Tabs.findOneAndUpdate(
        { _id: tabId },
        { $set: result },
        { new: true }
      );
      return response.status(200).json({
        success: true,
        message: "Tab edited successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getTabStats(request, response, next) {
    try {
      const data = await Tabs.aggregate([
        {
          $project: { datapointCount: { $size: "$dataPoints" } },
        },
      ]);
      return response.status(200).send(data);
    } catch (error) {
      next(error);
    }
  }
}
