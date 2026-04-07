export class DBRepository {
  nModel;
  constructor(model) {
    this.nModel = model;
  }

  async create(data) {
    return await this.nModel.create(data);
  }

  async update(filter, data, options = { new: true }) {
    return await this.nModel.findOneAndUpdate(filter, data, options);
  }

  async getOne(filter, projection = {}, options = {}) {
    return await this.nModel.findOne(filter, projection, options);
  }

  async find(filter, projection = {}, options = {}) {
    return await this.nModel.find(filter, projection, options);
  }

  async deleteOne(filter) {
    return await this.nModel.deleteOne(filter);
  }

  // async save(){
  //   return await this.nModel.save();
  // }
}
