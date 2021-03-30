const gameModule = require('../../model').Game;
const systemRequirementModule = require('../../model').SystemRequirement
const GameImg = require('../../model').GameImg
const fs = require('fs');
const path = require('path');
const formiable = require('formidable');

class gameCto {
  constructor() {
    this.instance = gameModule
  }
  async create(body) {
    const { name, desc, img_list, release_date, developer, publisher, game_type, price, is_onshelf } = body
    try {
      
      let hasOne = await this.instance.findAll({ where: { name: name } })
      if (hasOne.length > 0) {
        return { code: 0, msg: '不可重复添加' }
      }
      let res = await this.instance.create({ name: name, desc: desc, release_date: release_date, developer: developer, publisher: publisher, game_type: game_type, price: price, is_onshelf: is_onshelf })
      let pushList = img_list.split(',').map(a=>{return {path: a, goods_id: res.id}})
      await GameImg.bulkCreate(pushList)
      return { code: 1, data: '创建成功', goodId: res.id }
    }
    catch (err) {
      console.log(err)
      return { code: 0, msg: JSON.stringify(err) }
    }
  }
  // 获取
  async getGameList() {
    try {
      let res = await this.instance.findAll()
      return { code: 1, data: res }
    } catch (err) { return { code: 0, msg: JSON.stringify(err) } }
  }
  // 获取单独一条
  async getGameById(data) {
    const { id } = data
    if (!id) {
      return { code: 0, msg: '缺少id' }
    }
    try {
      let res = await this.instance.findAll({
        where: { id: id }, 
        include: [{
          model: systemRequirementModule,
          where: { game_id: id },
          // required: false  //left join
        }]
      })
      if (res.length > 0) {
        return { code: 1, data: res[0] }
      } else {
        return { code: 0, msg: '无此商品' }
      }
    } catch (err) {
      console.log('error',err)
      return { code: 0, msg: JSON.stringify(err) }
    }
  }
  // 删除
  async deleteGameById(data) {
    const { id } = data
    if (!id) {
      return { code: 0, msg: '缺少id' }
    }
    try {
      this.instance.deleteItem({ where: { id: id } })
      let hasSR = await systemRequirementModule.findAll({ where: { goods_id: id } })
      if (hasSR.length > 0) {
        let hasSRIds = hasSR.map(a => a.id)
        await systemRequirementModule.deleteItem({ id: hasSRIds })
      }
      return { code: 1, data: '删除成功' }
    } catch (err) { return { code: 0, msg: JSON.stringify(err) } }
  }
  async edit(body) {
    const { id, name, desc, release_date, developer, publisher, game_type, price, is_onshelf } = body
    try {
      let hasOne = await this.instance.findAll({ where: { id: id } })
      if (hasOne.length < 1) {
        return { code: 0, msg: '无此数据' }
      }
      this.instance.update({ name: name, desc: desc, release_date: release_date, developer: developer, publisher: publisher, game_type: game_type, price: price, is_onshelf: is_onshelf }, { where: { id: id } })
      return { code: 1, data: '修改成功' }
    }
    catch (err) {
      return { code: 0, msg: JSON.stringify(err) }
    }
  }

  // 单张图片上传
  async uploadSingleImg(req){
    let form = new formiable.IncomingForm();
    form.encoding = 'utf-8';
    
    form.uploadDir = path.join(__dirname, '../../public/upload'); 
    form.keepExtensions = true; // 是否包括 扩展名
    form.maxFieldsSize = 4 * 1024 * 1024; // 最大字节数
    // new Promise((resolve, rejects) => {

    // })
    let upload = new Promise((resolve, rejects) => {
      form.parse(req, (err, fields, files) => {
        let file = files.file
        if(err) {
          rejects({code: 0, msg: '上传失败'})
        }
        if (file.size > form.maxFileSize) {
          fs.unlink(file.path);
          rejects({code: 0, msg: '图片不得超过4M'})
        }
        let extName = ''
        if (file.type == "image/png" || file.type == "image/x-png") {
          extName = "png";
        } else if (file.type == "image/jpg" || file.type == "image/jpeg") {
          extName = "jpg";
        }
        if(extName.length == 0) {
          rejects({code: 0, msg: '只支持png与jpg格式的图片'})
        }
        let timestamp = Number(new Date())
        let num = Math.floor(Math.random() * 1000)
        let imageName = `${timestamp}_${num}.${extName}`;
        let newPath = form.uploadDir + '/' + imageName
        fs.rename(file.path, newPath, (err) => {
          if (err) {
            rejects({code: 0, msg: 'error'})
          }
        });
        resolve({code: 1, path: 'upload/'+imageName}) 
      })
    })
    let res = await upload
    return res
  }
}

module.exports = new gameCto()