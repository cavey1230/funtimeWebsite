//角色身份
import Mentor from "@/assets/img/role/Mentor.png";
import BattleMentor from "@/assets/img/role/BattleMentor.png";
import PvPMentor from "@/assets/img/role/PvPMentor.png";
import TradeMentor from "@/assets/img/role/TradeMentor.png";
import Beginner from "@/assets/img/role/Beginner.png";
import Returner from "@/assets/img/role/Returner.png";
import Rper from "@/assets/img/role/Rper.png";
import Normaler from "@/assets/img/role/Normaler.png";

//战斗职业图片
import Astrologian from "@/assets/img/battle/Astrologian.png";
import Bard from "@/assets/img/battle/Bard.png";
import BlackMage from "@/assets/img/battle/BlackMage.png";
import BlueMage from "@/assets/img/battle/BlueMage.png";
import Dancer from "@/assets/img/battle/Dancer.png";
import DarkKnight from "@/assets/img/battle/DarkKnight.png";
import Dragoon from "@/assets/img/battle/Dragoon.png";
import Gunbreaker from "@/assets/img/battle/Gunbreaker.png";
import Machinist from "@/assets/img/battle/Machinist.png";
import Monk from "@/assets/img/battle/Monk.png";
import Ninja from "@/assets/img/battle/Ninja.png";
import Paladin from "@/assets/img/battle/Paladin.png";
import RedMage from "@/assets/img/battle/RedMage.png";
import Samurai from "@/assets/img/battle/Samurai.png";
import Scholar from "@/assets/img/battle/Scholar.png";
import Summoner from "@/assets/img/battle/Summoner.png";
import Warrior from "@/assets/img/battle/Warrior.png";
import WhiteMage from "@/assets/img/battle/WhiteMage.png";

//生产采集职业
import Alchemist from "@/assets/img/trader/Alchemist.png";
import Armorer from "@/assets/img/trader/Armorer.png";
import Blacksmith from "@/assets/img/trader/Blacksmith.png";
import Botanist from "@/assets/img/trader/Botanist.png";
import Carpenter from "@/assets/img/trader/Carpenter.png";
import Culinarian from "@/assets/img/trader/Culinarian.png";
import Fisher from "@/assets/img/trader/Fisher.png";
import Goldsmith from "@/assets/img/trader/Goldsmith.png";
import Leatherworker from "@/assets/img/trader/Leatherworker.png";
import Miner from "@/assets/img/trader/Miner.png";
import Weaver from "@/assets/img/trader/Weaver.png";

//生产采集职业
export const traderImgAddress = (name: string) => {
    //角色身份
    switch (name) {
        case "炼金术士":
            return Alchemist
        case "铸甲匠":
            return Armorer
        case "锻铁匠":
            return Blacksmith
        case "园艺工":
            return Botanist
        case "刻木匠":
            return Carpenter
        case "烹调师":
            return Culinarian
        case "捕鱼人":
            return Fisher
        case "雕金匠":
            return Goldsmith
        case "制革匠":
            return Leatherworker
        case "采矿工":
            return Miner
        case "裁衣匠":
            return Weaver
        default:
            return ""
    }
}

//战斗职业
export const battleImgAddress = (name: string) => {
    //角色身份
    switch (name) {
        case "占星术士":
            return Astrologian
        case "吟游诗人":
            return Bard
        case "黑魔法师":
            return BlackMage
        case "青魔法师":
            return BlueMage
        case "舞者":
            return Dancer
        case "暗黑骑士":
            return DarkKnight
        case "龙骑士":
            return Dragoon
        case "绝枪战士":
            return Gunbreaker
        case "机工士":
            return Machinist
        case "武僧":
            return Monk
        case "忍者":
            return Ninja
        case "骑士":
            return Paladin
        case "赤魔法师":
            return RedMage
        case "武士":
            return Samurai
        case "学者":
            return Scholar
        case "召唤":
            return Summoner
        case "战士":
            return Warrior
        case "白魔法师":
            return WhiteMage
        default:
            return ""
    }
}

//角色身份
export const roleImgAddress = (name: string) => {
    switch (name) {
        case "导师":
            return Mentor
        case "战斗导师":
            return BattleMentor
        case "PvP导师":
            return PvPMentor
        case "生产导师":
            return TradeMentor
        case "回归者":
            return Returner
        case "豆芽":
            return Beginner
        case "无状态":
            return Normaler
        case "角色扮演":
            return Rper
        default:
            return ""
    }
}

