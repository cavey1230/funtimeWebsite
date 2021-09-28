//角色身份
import Mentor from "@/assets/img/role/Mentor.0d79cbba.png";
import BattleMentor from "@/assets/img/role/BattleMentor.cfe53430.png";
import PvPMentor from "@/assets/img/role/PvPMentor.52f2afda.png";
import TradeMentor from "@/assets/img/role/TradeMentor.1f47bea8.png";
import Beginner from "@/assets/img/role/Beginner.ca1fdc74.png";
import Returner from "@/assets/img/role/Returner.734f10f6.png";

//战斗职业图片
import Astrologian from "@/assets/img/battle/Astrologian.b24d46a2.png";
import Bard from "@/assets/img/battle/Bard.7f8a0c9c.png";
import BlackMage from "@/assets/img/battle/BlackMage.0f418ee2.png";
import BlueMage from "@/assets/img/battle/BlueMage-Red.65cc0427.png";
import Dancer from "@/assets/img/battle/Dancer.78cb8bba.png";
import DarkKnight from "@/assets/img/battle/DarkKnight.a6a85d1b.png";
import Dragoon from "@/assets/img/battle/Dragoon.4cf940e4.png";
import Gunbreaker from "@/assets/img/battle/Gunbreaker.db8ec4c3.png";
import Machinist from "@/assets/img/battle/Machinist.8e24d2e8.png";
import Monk from "@/assets/img/battle/Monk.14ebc670.png";
import Ninja from "@/assets/img/battle/Ninja.28a728bd.png";
import Paladin from "@/assets/img/battle/Paladin.7858bd6b.png";
import RedMage from "@/assets/img/battle/RedMage.cf44d5b3.png";
import Samurai from "@/assets/img/battle/Samurai.119867c9.png";
import Scholar from "@/assets/img/battle/Scholar.2e0c330a.png";
import Summoner from "@/assets/img/battle/Summoner.87c444c5.png";
import Warrior from "@/assets/img/battle/Warrior.a3dfb198.png";
import WhiteMage from "@/assets/img/battle/WhiteMage.0cfe86ea.png";

//生产采集职业
import Alchemist from "@/assets/img/trader/Alchemist.852299bd.png";
import Armorer from "@/assets/img/trader/Armorer.cf2d6314.png";
import Blacksmith from "@/assets/img/trader/Blacksmith.8bdd9d1b.png";
import Botanist from "@/assets/img/trader/Botanist.a7a9bddf.png";
import Carpenter from "@/assets/img/trader/Carpenter.cf89f4b7.png";
import Culinarian from "@/assets/img/trader/Culinarian.378971f7.png";
import Fisher from "@/assets/img/trader/Fisher.987a5c5a.png";
import Goldsmith from "@/assets/img/trader/Goldsmith.727930fd.png";
import Leatherworker from "@/assets/img/trader/Leatherworker.f3e4ea4c.png";
import Miner from "@/assets/img/trader/Miner.dbdddfe8.png";
import Weaver from "@/assets/img/trader/Weaver.eddda4a2.png";

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
        default:
            return ""
    }
}

