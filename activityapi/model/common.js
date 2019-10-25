const daoBase = require('../core/database/daoBase');

const GET_DISTRICTS = "call proc_BAS_GetDistrict(?);";
const GET_SLIDERS = `select psi.image_id,psi.image_topic,psi.image_subtitle,psi.image_url,psi.image_href,psi.image_json
                    from portal_slider as ps
                    inner JOIN portal_slider_image as psi on psi.slider_id=ps.slider_id and psi.image_disabled=0
                    where ps.slider_key=? and ps.rec_isdeleted=0 and psi.image_platform=?
                    and (psi.image_start is NULL or psi.image_start<=now()) and (psi.image_end is null or psi.image_end>=now())
                    order by psi.image_index DESC`;


class CommonModel extends daoBase {
    getDistricts(parentid) {
        return this.database.executeSql(GET_DISTRICTS, parentid);
    }

    getSliders(sliderkey, platform) {
        return this.database.executeSql(GET_SLIDERS, [sliderkey, platform]);
    }
}
exports = module.exports = CommonModel;