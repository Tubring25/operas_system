const systemRequirementModule = require('../../model/admin/systemRequirement/systemRequirement')

class systemRCto {
  constructor() {
    this.instance = systemRequirementModule
  }
  async getSystemR (body) {
    const {goodsId} = body
    try {
      let res = await this.instance.finaAll({where: {goodsId: goodsId}})
      return {code: 1, data: res.data}
    }catch(err) { return {code: 0, msg: JSON.stringify(err)} }
  }
  async editSystemR(body) {
    const { id, handle_system, cpu, ram, ram_unit, gpu, storage_space, storage_space_unit } = body
    try {
      let keys = Object.keys(body)
      for(let key of keys){
        if(typeof(body[key] == 'nubmer')) continue
        if(!body[key]) {
          return {code: 0, msg: key + '不可为空'}
        }
        await this.instance.update({
          handle_system: handle_system, cpu: cpu, ram: ram, ram_unit: ram_unit,
          gpu: gpu, storage_space: storage_space, storage_space_unit: storage_space_unit
        },{where: {id: id}})
        return {code: 1, data: 'success'}
      }
    }catch(err) { return {code: 0, msg: JSON.stringify(err)} }
  }
  async createSystemR(body) {
    const { req_type, handle_system, cpu, ram, ram_unit, gpu, storage_space, storage_space_unit, goods_id } = body
    try {
      let hasOne = await this.instance.findAll({where: {goods_id: goods_id, req_type: req_type}})
      if(hasOne.length>0) {
        return {code: 0, msg: '不可重复添加'}
      }
      await this.instance.create({req_type: req_type, handle_system: handle_system, cpu: cpu, ram: ram, ram_unit: ram_unit, gpu: gpu, storage_space: storage_space, storage_space_unit: storage_space_unit, goods_id: goods_id})
      return {code: 1, data: 'success'}
    }catch(err) { return {code: 0, msg: JSON.stringify(err)} }
  }
  
}

module.exports = new systemRCto()