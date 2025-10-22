'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Results from '../components/Result';
import { getAllEsimData, filterEsimData } from '../services/esimService';
import { LanguageProvider } from '../contexts/LanguageContext';
import { BenefitsSection3D, FinalCTASection3D, RealPlansSection, TestimonialsSection3D } from '@/components/AllSections';
import { Search, X, Smartphone, Check, ExternalLink } from 'lucide-react';

// Lista de dispositivos compatibles
const compatibleDevices = {
    "data": [
        {
            "model": "X20",
            "os": "android",
            "brand": "ABCTECH",
            "name": "X20"
        },
        {
            "model": "T803D",
            "os": "android",
            "brand": "Alcatel",
            "name": "V3 Ultra"
        },
        {
            "model": "ASUS_X00T_2",
            "os": "android",
            "brand": "asus",
            "name": "ZenFone Max Pro M1 (ZB602KL) (WW) / Max Pro M1 (ZB601KL) (IN)"
        },
        {
            "model": "ASUS_X00T_3",
            "os": "android",
            "brand": "asus",
            "name": "ZenFone Max Pro M1 (ZB602KL) (WW) / Max Pro M1 (ZB601KL) (IN)"
        },
        {
            "model": "ASUS_X00T_4",
            "os": "android",
            "brand": "asus",
            "name": "ZenFone Max Pro M1 (ZB602KL) (WW) / Max Pro M1 (ZB601KL) (IN)"
        },
        {
            "model": "ASUS_X00T_6",
            "os": "android",
            "brand": "asus",
            "name": "ZenFone Max Pro M1 (ZB602KL) (WW) / Max Pro M1 (ZB601KL) (IN)"
        },
        {
            "model": "ASUS_X00T_8",
            "os": "android",
            "brand": "asus",
            "name": "ZenFone Max Pro M1 (ZB602KL) (WW) / Max Pro M1 (ZB601KL) (IN)"
        },
        {
            "model": "ASUS_X01BD_1",
            "os": "android",
            "brand": "asus",
            "name": "ZenFone Max Pro M2 (ZB631KL) (WW) / Max Pro M2 (ZB630KL) (IN)"
        },
        {
            "model": "ASUS_X01BD_2",
            "os": "android",
            "brand": "asus",
            "name": "ZenFone Max Pro M2 (ZB631KL) (WW) / Max Pro M2 (ZB630KL) (IN)"
        },
        {
            "model": "A101BM",
            "os": "android",
            "brand": "BALMUDA",
            "name": "BALMUDA Phone"
        },
        {
            "model": "zangya_sprout",
            "os": "android",
            "brand": "bq",
            "name": "Aquaris X2"
        },
        {
            "model": "zangyapro_sprout",
            "os": "android",
            "brand": "bq",
            "name": "Aquaris X2 PRO"
        },
        {
            "model": "B610A115",
            "os": "android",
            "brand": "CIBER",
            "name": "B610A115"
        },
        {
            "model": "CP-G3",
            "os": "android",
            "brand": "Covia",
            "name": "CP-G3"
        },
        {
            "model": "SH-52C",
            "os": "android",
            "brand": "DOCOMO",
            "name": "AQUOS R7"
        },
        {
            "model": "SH-53C",
            "os": "android",
            "brand": "DOCOMO",
            "name": "AQUOS sense7"
        },
        {
            "model": "SO-51C",
            "os": "android",
            "brand": "docomo",
            "name": "Xperia 1 IV"
        },
        {
            "model": "SO-54C",
            "os": "android",
            "brand": "docomo",
            "name": "Xperia 5 IV"
        },
        {
            "model": "M23",
            "os": "android",
            "brand": "DOOGEE",
            "name": "V30"
        },
        {
            "model": "d-51C",
            "os": "android",
            "brand": "dtab",
            "name": "dtab d-51C"
        },
        {
            "model": "H620SEU",
            "os": "android",
            "brand": "Energizer",
            "name": "Hardcase H620S"
        },
        {
            "model": "StrongPhone_G9",
            "os": "android",
            "brand": "Evolveo",
            "name": "EVOLVEO StrongPhone G9"
        },
        {
            "model": "FP4",
            "os": "android",
            "brand": "Fairphone",
            "name": "Fairphone4"
        },
        {
            "model": "A101FC",
            "os": "android",
            "brand": "FCNT",
            "name": "arrows We A101FC"
        },
        {
            "model": "BZ03",
            "os": "android",
            "brand": "FCNT",
            "name": "arrows BZ03"
        },
        {
            "model": "F51C",
            "os": "android",
            "brand": "FCNT",
            "name": "arrows N F-51C"
        },
        {
            "model": "gila",
            "os": "android",
            "brand": "Fossil",
            "name": "Fossil Gen 5 LTE"
        },
        {
            "model": "GX4_PRO",
            "os": "android",
            "brand": "Gigaset",
            "name": "Gigaset GX4 PRO"
        },
        {
            "model": "barbet",
            "os": "android",
            "brand": "google",
            "name": "Pixel 5a 5G"
        },
        {
            "model": "bluejay",
            "os": "android",
            "brand": "google",
            "name": "Pixel 6a"
        },
        {
            "model": "blueline",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 3"
        },
        {
            "model": "bonito",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 3a XL"
        },
        {
            "model": "bramble",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 4a (5G)"
        },
        {
            "model": "cheetah",
            "os": "android",
            "brand": "google",
            "name": "Pixel 7 Pro"
        },
        {
            "model": "coral",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 4 XL"
        },
        {
            "model": "crosshatch",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 3 XL"
        },
        {
            "model": "flame",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 4"
        },
        {
            "model": "G1MNW",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 8 Pro"
        },
        {
            "model": "G82U8",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 7a"
        },
        {
            "model": "G9BOD",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 8"
        },
        {
            "model": "GC3VE",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 8 Pro"
        },
        {
            "model": "GHL1X",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 7a"
        },
        {
            "model": "GKWS6",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 8"
        },
        {
            "model": "GODZO",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 7a"
        },
        {
            "model": "GP4BC",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 7 Pro"
        },
        {
            "model": "GPJ41",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 8"
        },
        {
            "model": "GVU6C",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 7"
        },
        {
            "model": "GWKK3",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 7a"
        },
        {
            "model": "oriole",
            "os": "android",
            "brand": "google",
            "name": "Pixel 6"
        },
        {
            "model": "panther",
            "os": "android",
            "brand": "google",
            "name": "Pixel 7"
        },
        {
            "model": "Pixel Fold",
            "os": "android",
            "brand": "Google",
            "name": "Pixel Fold"
        },
        {
            "model": "raven",
            "os": "android",
            "brand": "google",
            "name": "Pixel 6 Pro"
        },
        {
            "model": "redfin",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 5"
        },
        {
            "model": "sargo",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 3a"
        },
        {
            "model": "sunfish",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 4a"
        },
        {
            "model": "taimen",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 2 XL"
        },
        {
            "model": "walleye",
            "os": "android",
            "brand": "Google",
            "name": "Pixel 2"
        },
        {
            "model": "MIELS",
            "os": "android",
            "brand": "Hamic",
            "name": "MIELS"
        },
        {
            "model": "Hammer_Blade_3",
            "os": "android",
            "brand": "Hammer",
            "name": "Hammer Blade 3"
        },
        {
            "model": "Hammer_Blade_5G",
            "os": "android",
            "brand": "Hammer",
            "name": "Hammer Blade 5G"
        },
        {
            "model": "Hammer_Construction",
            "os": "android",
            "brand": "Hammer",
            "name": "Hammer Construction"
        },
        {
            "model": "Hammer_Expl_Pro",
            "os": "android",
            "brand": "Hammer",
            "name": "Hammer Explorer Pro"
        },
        {
            "model": "CT30P",
            "os": "android",
            "brand": "Honeywell",
            "name": "CT30XP"
        },
        {
            "model": "CT45P",
            "os": "android",
            "brand": "Honeywell",
            "name": "CT45 XP"
        },
        {
            "model": "CT47",
            "os": "android",
            "brand": "Honeywell",
            "name": "CT47"
        },
        {
            "model": "EDA52",
            "os": "android",
            "brand": "Honeywell",
            "name": "EDA52"
        },
        {
            "model": "EDA5S",
            "os": "android",
            "brand": "Honeywell",
            "name": "EDA5S"
        },
        {
            "model": "HNFRI",
            "os": "android",
            "brand": "HONOR",
            "name": "FRI"
        },
        {
            "model": "HNLGE",
            "os": "android",
            "brand": "HONOR",
            "name": "HONOR Magic4 Pro"
        },
        {
            "model": "HNPGT",
            "os": "android",
            "brand": "HONOR",
            "name": "HONOR Magic5 Pro"
        },
        {
            "model": "LGE-AN10",
            "os": "android",
            "brand": "Honor",
            "name": "Honor Magic4 Pro"
        },
        {
            "model": "REA-NX9",
            "os": "android",
            "brand": "Honor",
            "name": "Honor 90"
        },
        {
            "model": "HZ0010J",
            "os": "android",
            "brand": "Hoozo",
            "name": "HZ0010J"
        },
        {
            "model": "ANA-AN00",
            "os": "android",
            "brand": "Huawei",
            "name": "P40"
        },
        {
            "model": "ANA-LX4",
            "os": "android",
            "brand": "Huawei",
            "name": "P40"
        },
        {
            "model": "ANA-NX9",
            "os": "android",
            "brand": "Huawei",
            "name": "P40"
        },
        {
            "model": "ANA-TN00",
            "os": "android",
            "brand": "Huawei",
            "name": "P40"
        },
        {
            "model": "ELS-AN00",
            "os": "android",
            "brand": "Huawei",
            "name": "P40 Pro"
        },
        {
            "model": "ELS-N04",
            "os": "android",
            "brand": "Huawei",
            "name": "P40 Pro"
        },
        {
            "model": "ELS-NX9",
            "os": "android",
            "brand": "Huawei",
            "name": "P40 Pro"
        },
        {
            "model": "ELS-TN00",
            "os": "android",
            "brand": "Huawei",
            "name": "P40 Pro"
        },
        {
            "model": "NOH-AN00",
            "os": "android",
            "brand": "Huawei",
            "name": "Mate 40 Pro"
        },
        {
            "model": "NOH-NX9",
            "os": "android",
            "brand": "Huawei",
            "name": "Mate 40 Pro"
        },
        {
            "model": "IS540",
            "os": "android",
            "brand": "isafemobile",
            "name": "IS540"
        },
        {
            "model": "ANK",
            "os": "android",
            "brand": "KDDI",
            "name": "AQUOS wish2"
        },
        {
            "model": "BOL",
            "os": "android",
            "brand": "KDDI",
            "name": "AQUOS sense6s"
        },
        {
            "model": "IVR",
            "os": "android",
            "brand": "KDDI",
            "name": "AQUOS sense7"
        },
        {
            "model": "SOG06",
            "os": "android",
            "brand": "KDDI",
            "name": "Xperia 1 IV"
        },
        {
            "model": "SOG07",
            "os": "android",
            "brand": "KDDI",
            "name": "Xperia 10 IV"
        },
        {
            "model": "SOG08",
            "os": "android",
            "brand": "KDDI",
            "name": "Xperia Ace III"
        },
        {
            "model": "SOG09",
            "os": "android",
            "brand": "KDDI",
            "name": "Xperia 5 IV"
        },
        {
            "model": "XKH",
            "os": "android",
            "brand": "KDDI",
            "name": "AQUOS zero6"
        },
        {
            "model": "YLI",
            "os": "android",
            "brand": "KDDI",
            "name": "AQUOS wish"
        },
        {
            "model": "ZMJ",
            "os": "android",
            "brand": "KDDI",
            "name": "AQUOS sense6"
        },
        {
            "model": "A001KC",
            "os": "android",
            "brand": "KYOCERA",
            "name": "かんたんスマホ２"
        },
        {
            "model": "A201KC",
            "os": "android",
            "brand": "KYOCERA",
            "name": "かんたんスマホ2+"
        },
        {
            "model": "KC-S304",
            "os": "android",
            "brand": "KYOCERA",
            "name": "DIGNO SANGA edition"
        },
        {
            "model": "KY21L-ST100",
            "os": "android",
            "brand": "KYOCERA",
            "name": "DIGNO SX2"
        },
        {
            "model": "KY22L-SN300",
            "os": "android",
            "brand": "KYOCERA",
            "name": "かんたんスマホ3"
        },
        {
            "model": "KY22L-ST200",
            "os": "android",
            "brand": "KYOCERA",
            "name": "DIGNO SX3"
        },
        {
            "model": "S10-KC_sprout",
            "os": "android",
            "brand": "KYOCERA",
            "name": "Android One S10"
        },
        {
            "model": "S9-KC_sprout",
            "os": "android",
            "brand": "KYOCERA",
            "name": "Android One S9"
        },
        {
            "model": "d-42A",
            "os": "android",
            "brand": "Lenovo",
            "name": "d-42A"
        },
        {
            "model": "d-52C",
            "os": "android",
            "brand": "Lenovo",
            "name": "d-52C"
        },
        {
            "model": "LOGIC_MV01",
            "os": "android",
            "brand": "LOGIC",
            "name": "LOGIC MV01"
        },
        {
            "model": "LOGIC_MV02",
            "os": "android",
            "brand": "LOGIC",
            "name": "LOGIC MV02"
        },
        {
            "model": "hera_pro",
            "os": "android",
            "brand": "MiTAC",
            "name": "N672"
        },
        {
            "model": "surfing_pro",
            "os": "android",
            "brand": "MiTAC",
            "name": "N630"
        },
        {
            "model": "rover",
            "os": "android",
            "brand": "Mobvoi",
            "name": "TicWatch Pro 3 Cellular/LTE"
        },
        {
            "model": "coralia",
            "os": "android",
            "brand": "Montblanc",
            "name": "Summit 2+"
        },
        {
            "model": "cypfr",
            "os": "android",
            "brand": "motorola",
            "name": "moto g52j 5G"
        },
        {
            "model": "MC40B",
            "os": "android",
            "brand": "Motorola",
            "name": "Edge 40 Neo"
        },
        {
            "model": "MOTXT22014W",
            "os": "android",
            "brand": "Motorola",
            "name": "Edge+ Plus (2022)"
        },
        {
            "model": "olson",
            "os": "android",
            "brand": "Motorola",
            "name": "motorola razr"
        },
        {
            "model": "oneli",
            "os": "android",
            "brand": "motorola",
            "name": "motorola razr 2022"
        },
        {
            "model": "penang",
            "os": "android",
            "brand": "motorola",
            "name": "moto g53y 5G"
        },
        {
            "model": "smith",
            "os": "android",
            "brand": "Motorola",
            "name": "motorola razr 5G"
        },
        {
            "model": "XT2061-3",
            "os": "android",
            "brand": "Motorola",
            "name": "Edge+ Plus"
        },
        {
            "model": "XT2201-4",
            "os": "android",
            "brand": "Motorola",
            "name": "Edge+ Plus (2022)"
        },
        {
            "model": "XT2201DL",
            "os": "android",
            "brand": "Motorola",
            "name": "Edge+ Plus (2022)"
        },
        {
            "model": "XT2251-1",
            "os": "android",
            "brand": "Motorola",
            "name": "Razr 2022"
        },
        {
            "model": "XT2301-4",
            "os": "android",
            "brand": "Motorola",
            "name": "Edge 40 Pro"
        },
        {
            "model": "XT2303-1",
            "os": "android",
            "brand": "Motorola",
            "name": "Edge 40"
        },
        {
            "model": "XT2303-2",
            "os": "android",
            "brand": "Motorola",
            "name": "Edge 40"
        },
        {
            "model": "XT2307-1",
            "os": "android",
            "brand": "Motorola",
            "name": "Edge 40 Neo"
        },
        {
            "model": "XT2321-3",
            "os": "android",
            "brand": "Motorola",
            "name": "Razr 40 Ultra"
        },
        {
            "model": "XT2335-1",
            "os": "android",
            "brand": "Motorola",
            "name": "Moto G53"
        },
        {
            "model": "XT2335-2",
            "os": "android",
            "brand": "Motorola",
            "name": "Moto G53 5G"
        },
        {
            "model": "XT2343",
            "os": "android",
            "brand": "Motorola",
            "name": "Moto G54"
        },
        {
            "model": "mkz_sdm660_64",
            "os": "android",
            "brand": "Motorola Solutions",
            "name": "MOTOTRBO ION"
        },
        {
            "model": "Hammer_Blade_3",
            "os": "android",
            "brand": "Myphone",
            "name": "Hammer Blade 3"
        },
        {
            "model": "Hammer_Expl_Pro",
            "os": "android",
            "brand": "Myphone",
            "name": "Hammer Explorer Pro"
        },
        {
            "model": "myPhone_Now_eSIM",
            "os": "android",
            "brand": "Myphone",
            "name": "myPhone Now eSIM"
        },
        {
            "model": "Hammer_Explorer",
            "os": "android",
            "brand": "MyPhone (PL)",
            "name": "Hammer_Explorer"
        },
        {
            "model": "APO_sprout",
            "os": "android",
            "brand": "Nokia",
            "name": "Nokia G60 5G"
        },
        {
            "model": "FCN_sprout",
            "os": "android",
            "brand": "Nokia",
            "name": "Nokia X30 5G"
        },
        {
            "model": "TA-1486",
            "os": "android",
            "brand": "Nokia",
            "name": "XR21"
        },
        {
            "model": "A024",
            "os": "android",
            "brand": "Nothing",
            "name": "Phone (3)"
        },
        {
            "model": "A059P",
            "os": "android",
            "brand": "Nothing",
            "name": "Phone Pro"
        },
        {
            "model": "CPH2645",
            "os": "android",
            "brand": "OnePlus",
            "name": "13R"
        },
        {
            "model": "OP594DL1",
            "os": "android",
            "brand": "OnePlus",
            "name": "OnePlus 11 5G"
        },
        {
            "model": "PJD110",
            "os": "android",
            "brand": "OnePlus",
            "name": "OnePlus 12"
        },
        {
            "model": "PKX110",
            "os": "android",
            "brand": "OnePlus",
            "name": "13T"
        },
        {
            "model": "A77",
            "os": "android",
            "brand": "OPPO",
            "name": "A77"
        },
        {
            "model": "CPH2173",
            "os": "android",
            "brand": "OPPO",
            "name": "Find X3 Pro"
        },
        {
            "model": "CPH2305",
            "os": "android",
            "brand": "OPPO",
            "name": "Find X5 Pro"
        },
        {
            "model": "CPH2671",
            "os": "android",
            "brand": "Oppo",
            "name": "Find N5"
        },
        {
            "model": "OP4F2BL1",
            "os": "android",
            "brand": "OPPO",
            "name": "OPPO Reno5 A"
        },
        {
            "model": "OP4F57L1",
            "os": "android",
            "brand": "Oppo",
            "name": "Find X3 Pro"
        },
        {
            "model": "OP4F7FL1",
            "os": "android",
            "brand": "OPPO",
            "name": "CPH2247"
        },
        {
            "model": "OP52D1L1",
            "os": "android",
            "brand": "OPPO",
            "name": "Find X5 Pro"
        },
        {
            "model": "OP52D5L1",
            "os": "android",
            "brand": "OPPO",
            "name": "Find X5"
        },
        {
            "model": "OP52EBL1",
            "os": "android",
            "brand": "OPPO",
            "name": "A55s 5G"
        },
        {
            "model": "OP532BL1",
            "os": "android",
            "brand": "OPPO",
            "name": "OPPO Reno7 A"
        },
        {
            "model": "OP56CDL1",
            "os": "android",
            "brand": "OPPO",
            "name": "Find N2 Flip"
        },
        {
            "model": "orca",
            "os": "android",
            "brand": "Oppo",
            "name": "OPPO Watch"
        },
        {
            "model": "PBBM30",
            "os": "android",
            "brand": "OPPO",
            "name": "A5"
        },
        {
            "model": "PEEM00",
            "os": "android",
            "brand": "OPPO",
            "name": "Find X3 Pro"
        },
        {
            "model": "PFEM10",
            "os": "android",
            "brand": "OPPO",
            "name": "Find X5 Pro"
        },
        {
            "model": "PFFM10",
            "os": "android",
            "brand": "OPPO",
            "name": "Find X5"
        },
        {
            "model": "PFFM20",
            "os": "android",
            "brand": "OPPO",
            "name": "Find X5 Pro"
        },
        {
            "model": "PKZ110",
            "os": "android",
            "brand": "Oppo",
            "name": "Reno14 Pro"
        },
        {
            "model": "PLA110",
            "os": "android",
            "brand": "Oppo",
            "name": "Reno14"
        },
        {
            "model": "TAB-7304-16G3GS",
            "os": "android",
            "brand": "Premier",
            "name": "TAB-7304-16G3GS"
        },
        {
            "model": "C330",
            "os": "android",
            "brand": "Rakuten",
            "name": "C330"
        },
        {
            "model": "Chara",
            "os": "android",
            "brand": "RAKUTEN",
            "name": "AQUOS sense6"
        },
        {
            "model": "gaea",
            "os": "android",
            "brand": "Rakuten",
            "name": "Rakuten BIG s"
        },
        {
            "model": "JeridL",
            "os": "android",
            "brand": "RAKUTEN",
            "name": "AQUOS sense4 lite SH-RM15"
        },
        {
            "model": "Nee",
            "os": "android",
            "brand": "RAKUTEN",
            "name": "AQUOS sense6s"
        },
        {
            "model": "P710",
            "os": "android",
            "brand": "Rakuten",
            "name": "Rakuten Hand"
        },
        {
            "model": "P780",
            "os": "android",
            "brand": "Rakuten",
            "name": "Rakuten Hand5G"
        },
        {
            "model": "Recoa",
            "os": "android",
            "brand": "RAKUTEN",
            "name": "AQUOS zero6"
        },
        {
            "model": "SX1",
            "os": "android",
            "brand": "RAKUTEN",
            "name": "AQUOS wish"
        },
        {
            "model": "RZ45-0460",
            "os": "android",
            "brand": "Razer",
            "name": "Razer Edge 5G"
        },
        {
            "model": "14",
            "os": "android",
            "brand": "RealMe",
            "name": "RMX5070"
        },
        {
            "model": "RMX5051",
            "os": "android",
            "brand": "RealMe",
            "name": "14 Pro+"
        },
        {
            "model": "RMX5061",
            "os": "android",
            "brand": "RealMe",
            "name": "GT 7"
        },
        {
            "model": "b0q",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S22 Ultra"
        },
        {
            "model": "b0s",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S22 Ultra"
        },
        {
            "model": "b2q",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Flip3 5G"
        },
        {
            "model": "b4q",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy Z Flip4"
        },
        {
            "model": "bloomq",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Flip"
        },
        {
            "model": "bloomxq",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Flip 5G"
        },
        {
            "model": "c1q",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Note20 5G"
        },
        {
            "model": "c1s",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Note20"
        },
        {
            "model": "c2q",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Note20 Ultra 5G"
        },
        {
            "model": "c2s",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Note20 Ultra"
        },
        {
            "model": "dm1q",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S23"
        },
        {
            "model": "dm2q",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S23+"
        },
        {
            "model": "dm3q",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S23 Ultra"
        },
        {
            "model": "freshul",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Watch4"
        },
        {
            "model": "freshus",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Watch4"
        },
        {
            "model": "g0q",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S22+"
        },
        {
            "model": "g0s",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S22+"
        },
        {
            "model": "o1q",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S21 5G"
        },
        {
            "model": "o1s",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S21 5G"
        },
        {
            "model": "p3q",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S21 Ultra 5G"
        },
        {
            "model": "p3s",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S21 Ultra 5G"
        },
        {
            "model": "q4q",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy Z Fold4"
        },
        {
            "model": "r0q",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S22"
        },
        {
            "model": "r0s",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S22"
        },
        {
            "model": "SC-51D",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S23"
        },
        {
            "model": "SC-52D",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S23 Ultra"
        },
        {
            "model": "SC-54C",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy Z Flip4"
        },
        {
            "model": "SC-55C",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy Z Fold4"
        },
        {
            "model": "SC-56C",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy A23 5G"
        },
        {
            "model": "SCG16",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy Z Fold4"
        },
        {
            "model": "SCG17",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy Z Flip4"
        },
        {
            "model": "SM-A356E",
            "os": "android",
            "brand": "Samsung",
            "name": "A35"
        },
        {
            "model": "SM-A366E",
            "os": "android",
            "brand": "Samsung",
            "name": "A36"
        },
        {
            "model": "SM-A546B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy A54 5G"
        },
        {
            "model": "SM-A556B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy A55"
        },
        {
            "model": "SM-A556E",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy A55"
        },
        {
            "model": "SM-A566B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy A56"
        },
        {
            "model": "SM-A566E",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy A56"
        },
        {
            "model": "SM-F731B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Flip 5"
        },
        {
            "model": "SM-F761B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Flip7 FE"
        },
        {
            "model": "SM-F766B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Flip7"
        },
        {
            "model": "SM-F9007",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold"
        },
        {
            "model": "SM-F907B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold"
        },
        {
            "model": "SM-F907F",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold"
        },
        {
            "model": "SM-F907N",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold"
        },
        {
            "model": "SM-F907U",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold"
        },
        {
            "model": "SM-F907W",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold"
        },
        {
            "model": "SM-F9160",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold2"
        },
        {
            "model": "SM-F916B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold2"
        },
        {
            "model": "SM-F916N",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold2"
        },
        {
            "model": "SM-F916U",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold2"
        },
        {
            "model": "SM-F916U1",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold2"
        },
        {
            "model": "SM-F916W",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold2"
        },
        {
            "model": "SM-F9260",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold3"
        },
        {
            "model": "SM-F926B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold3"
        },
        {
            "model": "SM-F926B/DS",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold3"
        },
        {
            "model": "SM-F926N",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold3"
        },
        {
            "model": "SM-F926U",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold3"
        },
        {
            "model": "SM-F926U1",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold3"
        },
        {
            "model": "SM-F926W",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold3"
        },
        {
            "model": "SM-F946B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Fold 5"
        },
        {
            "model": "SM-F966B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Z Fold7"
        },
        {
            "model": "SM-G766B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy XCover7 Pro"
        },
        {
            "model": "SM-S7110",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S23 FE"
        },
        {
            "model": "SM-S721U",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy 24 FE"
        },
        {
            "model": "SM-S9010",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 5G"
        },
        {
            "model": "SM-S901B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 5G"
        },
        {
            "model": "SM-S901B/DS",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 5G"
        },
        {
            "model": "SM-S901E",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 5G"
        },
        {
            "model": "SM-S901E/DS",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 5G"
        },
        {
            "model": "SM-S901N",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 5G"
        },
        {
            "model": "SM-S901U",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 5G"
        },
        {
            "model": "SM-S901U1",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 5G"
        },
        {
            "model": "SM-S901W",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 5G"
        },
        {
            "model": "SM-S9060",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22+ 5G"
        },
        {
            "model": "SM-S906B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22+ 5G"
        },
        {
            "model": "SM-S906B/DS",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22+ 5G"
        },
        {
            "model": "SM-S906E",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22+ 5G"
        },
        {
            "model": "SM-S906E/DS",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22+ 5G"
        },
        {
            "model": "SM-S906N",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22+ 5G"
        },
        {
            "model": "SM-S906U",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22+ 5G"
        },
        {
            "model": "SM-S906U1",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22+ 5G"
        },
        {
            "model": "SM-S906W",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22+ 5G"
        },
        {
            "model": "SM-S9080",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 Ultra 5G"
        },
        {
            "model": "SM-S908B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 Ultra 5G"
        },
        {
            "model": "SM-S908B/DS",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 Ultra 5G"
        },
        {
            "model": "SM-S908E",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 Ultra 5G"
        },
        {
            "model": "SM-S908E/DS",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 Ultra 5G"
        },
        {
            "model": "SM-S908N",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 Ultra 5G"
        },
        {
            "model": "SM-S908U",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 Ultra 5G"
        },
        {
            "model": "SM-S908U1",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 Ultra 5G"
        },
        {
            "model": "SM-S908W",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S22 Ultra 5G"
        },
        {
            "model": "SM-S921",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S24"
        },
        {
            "model": "SM-S926",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S24+"
        },
        {
            "model": "SM-S928",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S24 Ultra"
        },
        {
            "model": "SM-S931B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S25"
        },
        {
            "model": "SM-S931U",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S25"
        },
        {
            "model": "SM-S931U1",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S25"
        },
        {
            "model": "SM-S936B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S25+"
        },
        {
            "model": "SM-S936U",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S25+"
        },
        {
            "model": "SM-S936U1",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S25+"
        },
        {
            "model": "SM-S937B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S25 Edge"
        },
        {
            "model": "SM-S937U",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S25 Edge"
        },
        {
            "model": "SM-S937U1",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S25 Edge"
        },
        {
            "model": "SM-S938B",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S25 Ultra"
        },
        {
            "model": "SM-S938U",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S25 Ultra"
        },
        {
            "model": "SM-S938U1",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S25 Ultra"
        },
        {
            "model": "t2q",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S21+ 5G"
        },
        {
            "model": "t2s",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S21+ 5G"
        },
        {
            "model": "wiseul",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Watch4 Classic"
        },
        {
            "model": "wiseus",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy Watch4 Classic"
        },
        {
            "model": "x1q",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S20 5G"
        },
        {
            "model": "x1s",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S20 5G"
        },
        {
            "model": "y2q",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S20+ 5G"
        },
        {
            "model": "y2s",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S20+ 5G"
        },
        {
            "model": "z3q",
            "os": "android",
            "brand": "samsung",
            "name": "Galaxy S20 Ultra 5G"
        },
        {
            "model": "z3s",
            "os": "android",
            "brand": "Samsung",
            "name": "Galaxy S20 Ultra 5G"
        },
        {
            "model": "Judau",
            "os": "android",
            "brand": "SG",
            "name": "AQUOS R6"
        },
        {
            "model": "Levil",
            "os": "android",
            "brand": "SG",
            "name": "シンプルスマホ６"
        },
        {
            "model": "Mineva",
            "os": "android",
            "brand": "SG",
            "name": "AQUOS R7"
        },
        {
            "model": "MinevaL",
            "os": "android",
            "brand": "SG",
            "name": "Leitz Phone 2"
        },
        {
            "model": "Nee",
            "os": "android",
            "brand": "SG",
            "name": "AQUOS sense6s"
        },
        {
            "model": "Quattro",
            "os": "android",
            "brand": "SG",
            "name": "AQUOS sense7 plus"
        },
        {
            "model": "Recoa",
            "os": "android",
            "brand": "SG",
            "name": "AQUOS zero6"
        },
        {
            "model": "SX1",
            "os": "android",
            "brand": "SG",
            "name": "AQUOS wish"
        },
        {
            "model": "SXI",
            "os": "android",
            "brand": "SG",
            "name": "AQUOS wish2"
        },
        {
            "model": "SGIN_E10M",
            "os": "android",
            "brand": "SGIN",
            "name": "SGIN_E10M"
        },
        {
            "model": "A102SH",
            "os": "android",
            "brand": "Sharp",
            "name": "Aquos Zero6"
        },
        {
            "model": "Aquos R10",
            "os": "android",
            "brand": "Sharp",
            "name": "SH-51F"
        },
        {
            "model": "AS6N",
            "os": "android",
            "brand": "Sharp",
            "name": "Aquos Sense6"
        },
        {
            "model": "Chara",
            "os": "android",
            "brand": "SHARP",
            "name": "AQUOS sense6"
        },
        {
            "model": "JeridL",
            "os": "android",
            "brand": "Sharp",
            "name": "AQUOS sense4 lite SH-RM15"
        },
        {
            "model": "Rakan",
            "os": "android",
            "brand": "SHARP",
            "name": "AQUOS sense7"
        },
        {
            "model": "Recoa",
            "os": "android",
            "brand": "SHARP",
            "name": "AQUOS zero6"
        },
        {
            "model": "SH-AC05",
            "os": "android",
            "brand": "Sharp",
            "name": "Aquos wish5"
        },
        {
            "model": "SH-RM18",
            "os": "android",
            "brand": "Sharp",
            "name": "Aquos Zero6"
        },
        {
            "model": "SH-Z60",
            "os": "android",
            "brand": "Sharp",
            "name": "Aquos Zero6"
        },
        {
            "model": "SHG06",
            "os": "android",
            "brand": "Sharp",
            "name": "Aquos Wish6"
        },
        {
            "model": "SX1",
            "os": "android",
            "brand": "SHARP",
            "name": "AQUOS wish"
        },
        {
            "model": "A201SO",
            "os": "android",
            "brand": "Sony",
            "name": "Xperia 1 IV"
        },
        {
            "model": "A202SO",
            "os": "android",
            "brand": "Sony",
            "name": "Xperia 10 IV"
        },
        {
            "model": "A203SO",
            "os": "android",
            "brand": "Sony",
            "name": "Xperia Ace III"
        },
        {
            "model": "A204SO",
            "os": "android",
            "brand": "Sony",
            "name": "Xperia 5 IV"
        },
        {
            "model": "XQ-BT44",
            "os": "android",
            "brand": "Sony",
            "name": "Xperia 10 III Lite"
        },
        {
            "model": "XQ-CC44",
            "os": "android",
            "brand": "Sony",
            "name": "Xperia 10 IV"
        },
        {
            "model": "XQ-CC54",
            "os": "android",
            "brand": "Sony",
            "name": "Xperia 10 IV"
        },
        {
            "model": "XQ-CQ44",
            "os": "android",
            "brand": "Sony",
            "name": "Xperia 5 IV"
        },
        {
            "model": "XQ-CQ54",
            "os": "android",
            "brand": "Sony",
            "name": "Xperia 5 IV"
        },
        {
            "model": "XQ-CT44",
            "os": "android",
            "brand": "Sony",
            "name": "Xperia 1 IV"
        },
        {
            "model": "XQ-CT54",
            "os": "android",
            "brand": "Sony",
            "name": "Xperia 1 IV"
        },
        {
            "model": "XQ-DQ54",
            "os": "android",
            "brand": "Sony",
            "name": "Xperia 1 V"
        },
        {
            "model": "XQ-FS54",
            "os": "android",
            "brand": "Sony",
            "name": "Experia 1 VII"
        },
        {
            "model": "duo",
            "os": "android",
            "brand": "Surface",
            "name": "Surface Duo"
        },
        {
            "model": "duo2",
            "os": "android",
            "brand": "surface",
            "name": "Surface Duo 2"
        },
        {
            "model": "Pro 9",
            "os": "android",
            "brand": "Surface",
            "name": "Surface Pro 9"
        },
        {
            "model": "TAG-TAB-III",
            "os": "android",
            "brand": "TAG-TECH",
            "name": "TAG-TAB-III"
        },
        {
            "model": "TAG-TAB-III",
            "os": "android",
            "brand": "TAGTECH",
            "name": "TAG-TAB-III"
        },
        {
            "model": "T705M1",
            "os": "android",
            "brand": "TCL",
            "name": "60 XE NxtPaper"
        },
        {
            "model": "X_EEA",
            "os": "android",
            "brand": "Teclast",
            "name": "X_EEA"
        },
        {
            "model": "TONE_e22",
            "os": "android",
            "brand": "TONE",
            "name": "TONE_e22"
        },
        {
            "model": "V-Z40",
            "os": "android",
            "brand": "VIKUSHA",
            "name": "V-Z40"
        },
        {
            "model": "V2219",
            "os": "android",
            "brand": "vivo",
            "name": "X90 Pro"
        },
        {
            "model": "‎V2244",
            "os": "android",
            "brand": "vivo",
            "name": "V29 Lite 5G"
        },
        {
            "model": "V2250",
            "os": "android",
            "brand": "vivo",
            "name": "V29"
        },
        {
            "model": "V2324A",
            "os": "android",
            "brand": "vivo",
            "name": "X100 Pro"
        },
        {
            "model": "V2348",
            "os": "android",
            "brand": "Vivo",
            "name": "V40"
        },
        {
            "model": "V2405A",
            "os": "android",
            "brand": "Vivo",
            "name": "X200"
        },
        {
            "model": "V2413",
            "os": "android",
            "brand": "Vivo",
            "name": "X200 Pro"
        },
        {
            "model": "V2415",
            "os": "android",
            "brand": "vivo",
            "name": "X200s"
        },
        {
            "model": "V2415A",
            "os": "android",
            "brand": "Vivo",
            "name": "X200"
        },
        {
            "model": "V2427",
            "os": "android",
            "brand": "Vivo",
            "name": "V50"
        },
        {
            "model": "PQ6001",
            "os": "android",
            "brand": "Vsmart",
            "name": "Active 1"
        },
        {
            "model": "24090RA29G",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Redmi Note 14 Pro 5G"
        },
        {
            "model": "24115RA8EG",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Redmi Note 14 Pro+ 5G"
        },
        {
            "model": "24129PN74G",
            "os": "android",
            "brand": "Xiaomi",
            "name": "15 Ultra"
        },
        {
            "model": "amethyst",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Redmi Note 14 Pro+"
        },
        {
            "model": "aristotle",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Xiaomi 13T"
        },
        {
            "model": "corot",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Xiaomi 13T Pro"
        },
        {
            "model": "dada",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Xiaomi 15"
        },
        {
            "model": "degas",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Xiaomi 14T"
        },
        {
            "model": "diting",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Xiaomi 12T Pro"
        },
        {
            "model": "emerald",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Redmi Note 13 Pro"
        },
        {
            "model": "fuxi",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Xiaomi 13"
        },
        {
            "model": "houji",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Xiaomi 14"
        },
        {
            "model": "nuwa",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Xiaomi 13 Pro"
        },
        {
            "model": "obsidian",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Redmi Note 14 Pro"
        },
        {
            "model": "pissarro",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Redmi Note 11 Pro 5G"
        },
        {
            "model": "rothko",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Xiaomi 14T Pro"
        },
        {
            "model": "shennong",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Xiaomi 14 Pro"
        },
        {
            "model": "zircon",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Redmi Note 13 Pro+"
        },
        {
            "model": "ziyi",
            "os": "android",
            "brand": "Xiaomi",
            "name": "Xiaomi 13 Lite"
        },
        {
            "model": "EC55",
            "os": "android",
            "brand": "Zebra",
            "name": "EC55"
        },
        {
            "model": "ET56L",
            "os": "android",
            "brand": "Zebra",
            "name": "ET56"
        },
        {
            "model": "ET56S",
            "os": "android",
            "brand": "Zebra",
            "name": "ET56"
        },
        {
            "model": "L10AW",
            "os": "android",
            "brand": "Zebra",
            "name": "Zebra Technologies L10"
        },
        {
            "model": "MC2700",
            "os": "android",
            "brand": "Zebra",
            "name": "Zebra Technologies MC2700"
        },
        {
            "model": "TC26",
            "os": "android",
            "brand": "Zebra",
            "name": "TC26"
        },
        {
            "model": "TC57",
            "os": "android",
            "brand": "Zebra",
            "name": "TC57"
        },
        {
            "model": "TC57X",
            "os": "android",
            "brand": "Zebra",
            "name": "Zebra Technologies TC57x"
        },
        {
            "model": "TC58",
            "os": "android",
            "brand": "Zebra",
            "name": "TC58"
        },
        {
            "model": "TC77",
            "os": "android",
            "brand": "Zebra",
            "name": "TC77"
        },
        {
            "model": "K105_EEA",
            "os": "android",
            "brand": "ZONKO",
            "name": "K105_EEA"
        },
        {
            "model": "Z6571S",
            "os": "android",
            "brand": "ZTE",
            "name": "A103ZT"
        },
        {
            "model": "Z6575S",
            "os": "android",
            "brand": "ZTE",
            "name": "A202ZT"
        },
        {
            "model": "Z7750R",
            "os": "android",
            "brand": "ZTE",
            "name": "ZR01"
        },
        {
            "model": "ZR01",
            "os": "android",
            "brand": "ZTE",
            "name": "RAKUTEN BIG"
        },
        {
            "model": "A2846",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 15"
        },
        {
            "model": "A2847",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 15 Plus"
        },
        {
            "model": "A2848",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 15 Pro"
        },
        {
            "model": "A2849",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 15 Pro Max"
        },
        {
            "model": "A3081",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 16"
        },
        {
            "model": "A3082",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 16 Plus"
        },
        {
            "model": "A3083",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 16 Pro"
        },
        {
            "model": "A3084",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 16 Pro Max"
        },
        {
            "model": "A3089",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 15"
        },
        {
            "model": "A3090",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 15"
        },
        {
            "model": "A3093",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 15 Plus"
        },
        {
            "model": "A3094",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 15 Plus"
        },
        {
            "model": "A3101",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 15 Pro"
        },
        {
            "model": "A3102",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 15 Pro"
        },
        {
            "model": "A3105",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 15 Pro Max"
        },
        {
            "model": "A3106",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 15 Pro Max"
        },
        {
            "model": "A3212",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 16e"
        },
        {
            "model": "A3286",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 16"
        },
        {
            "model": "A3287",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 16"
        },
        {
            "model": "A3289",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 16 Plus"
        },
        {
            "model": "A3290",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 16 Plus"
        },
        {
            "model": "A3292",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 16 Pro"
        },
        {
            "model": "A3293",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 16 Pro"
        },
        {
            "model": "A3295",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 16 Pro Max"
        },
        {
            "model": "A3296",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 16 Pro Max"
        },
        {
            "model": "A3408",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 16e"
        },
        {
            "model": "A3409",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 16e"
        },
        {
            "model": "iPad11,2",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad mini 5th Gen"
        },
        {
            "model": "iPad11,4",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad Air 3rd Gen"
        },
        {
            "model": "iPad11,7",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad 8th Gen (WiFi+Cellular)"
        },
        {
            "model": "iPad13,10",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad Pro 12.9 inch 5th Gen"
        },
        {
            "model": "iPad13,11",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad Pro 12.9 inch 5th Gen"
        },
        {
            "model": "iPad13,17",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad Air 5th Gen (WiFi+Cellular)"
        },
        {
            "model": "iPad13,19",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad 10th Gen"
        },
        {
            "model": "iPad13,2",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad air 4th Gen (WiFi+Cellular)"
        },
        {
            "model": "iPad13,5 ",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad Pro 11 inch 3rd Gen"
        },
        {
            "model": "iPad13,6",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad Pro 11 inch 3rd Gen"
        },
        {
            "model": "iPad13,9",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad Pro 12.9 inch 5th Gen"
        },
        {
            "model": "iPad14,4",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad Pro 11 inch 4th Gen"
        },
        {
            "model": "iPad14,6",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad Pro 12.9 inch 6th Gen"
        },
        {
            "model": "iPad8,10",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad Pro 11 inch 4th Gen (WiFi+Cellular)"
        },
        {
            "model": "iPad8,12",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad Pro 12.9 inch 4th Gen (WiFi+Cellular)"
        },
        {
            "model": "iPad8,3",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad Pro 11 inch 3rd Gen (WiFi+Cellular)"
        },
        {
            "model": "iPad8,4",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad Pro 11 inch 3rd Gen (1TB, WiFi+Cellular)"
        },
        {
            "model": "iPad8,7",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad Pro 12.9 inch 3rd Gen (WiFi+Cellular)"
        },
        {
            "model": "iPad8,8",
            "os": "ios",
            "brand": "Apple",
            "name": "iPad Pro 12.9 inch 3rd Gen (1TB, WiFi+Cellular)"
        },
        {
            "model": "iPhone11,2",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone XS"
        },
        {
            "model": "iPhone11,4",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone XS Max"
        },
        {
            "model": "iPhone11,6",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone XS Max Global"
        },
        {
            "model": "iPhone11,8",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone XR"
        },
        {
            "model": "iPhone12,1",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 11"
        },
        {
            "model": "iPhone12,3",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 11 Pro"
        },
        {
            "model": "iPhone12,5",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 11 Pro Max"
        },
        {
            "model": "iPhone12,8",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone SE 2nd Gen"
        },
        {
            "model": "iPhone13,1",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 12 Mini"
        },
        {
            "model": "iPhone13,2",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 12"
        },
        {
            "model": "iPhone13,3",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 12 Pro"
        },
        {
            "model": "iPhone13,4",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 12 Pro Max"
        },
        {
            "model": "iPhone14,2",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 13 Pro"
        },
        {
            "model": "iPhone14,3",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 13 Pro Max"
        },
        {
            "model": "iPhone14,4",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 13 Mini"
        },
        {
            "model": "iPhone14,5",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 13"
        },
        {
            "model": "iPhone14,6",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone SE 3rd Gen"
        },
        {
            "model": "iPhone14,7",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 14"
        },
        {
            "model": "iPhone14,8",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 14 Plus"
        },
        {
            "model": "iPhone15,2",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 14 Pro"
        },
        {
            "model": "iPhone15,3",
            "os": "ios",
            "brand": "Apple",
            "name": "iPhone 14 Pro Max"
        }
    ]
};

// Floating Button Component
const FloatingDeviceButton = ({ onClick }) => {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-2xl shadow-blue-500/25 border border-white/20 backdrop-blur-sm transition-all duration-300"
    >
      <Smartphone className="w-5 h-5" />
      <span className="font-semibold text-sm">Compatible Devices</span>
    </motion.button>
  );
};

// Device Compatibility Modal Component
const DeviceCompatibilityModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDevices, setFilteredDevices] = useState(compatibleDevices.data);
  const [selectedOS, setSelectedOS] = useState('all');

  useEffect(() => {
    let results = compatibleDevices.data;

    // Filter by search term
    if (searchTerm) {
      results = results.filter(device =>
        device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by OS
    if (selectedOS !== 'all') {
      results = results.filter(device => device.os === selectedOS);
    }

    setFilteredDevices(results);
  }, [searchTerm, selectedOS]);

  const getOSIcon = (os) => {
    switch (os) {
      case 'ios':
        return '📱';
      case 'android':
        return '🤖';
      default:
        return '📲';
    }
  };

  const getOSColor = (os) => {
    switch (os) {
      case 'ios':
        return 'bg-blue-500/20 text-blue-400 border-blue-400/30';
      case 'android':
        return 'bg-green-500/20 text-green-400 border-green-400/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-400/30';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-10 z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center space-x-3">
                      <Smartphone className="w-8 h-8" />
                      <span>Compatible Devices</span>
                    </h2>
                    <p className="text-blue-100 mt-2">
                      Check if your device supports eSIM technology
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Search and Filters */}
                <div className="mt-6 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by brand, model, or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:border-white/40 transition-colors"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setSelectedOS('all')}
                      className={`px-4 py-2 rounded-xl border transition-all duration-300 ${
                        selectedOS === 'all'
                          ? 'bg-white text-blue-600 border-white'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      All Devices
                    </button>
                    <button
                      onClick={() => setSelectedOS('ios')}
                      className={`px-4 py-2 rounded-xl border transition-all duration-300 flex items-center space-x-2 ${
                        selectedOS === 'ios'
                          ? 'bg-white text-blue-600 border-white'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {/* <span>📱</span> */}
                      <span>iOS</span>
                    </button>
                    <button
                      onClick={() => setSelectedOS('android')}
                      className={`px-4 py-2 rounded-xl border transition-all duration-300 flex items-center space-x-2 ${
                        selectedOS === 'android'
                          ? 'bg-white text-blue-600 border-white'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {/* <span>🤖</span> */}
                      <span>Android</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Device List */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-gray-600">
                    {filteredDevices.length} device{filteredDevices.length !== 1 ? 's' : ''} found
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>

                {filteredDevices.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No devices found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search terms or filters
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredDevices.map((device, index) => (
                      <motion.div
                        key={`${device.brand}-${device.model}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  {device.brand}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  {device.name}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getOSColor(device.os)}`}>
                                {device.os.toUpperCase()}
                              </span>
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200">
                                {device.model}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 text-green-600">
                              <Check className="w-4 h-4" />
                              <span className="text-sm font-medium">Compatible</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-6 bg-white">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-sm">
                      All listed devices support eSIM technology
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={onClose}
                      className="px-6 py-2 text-gray-600 hover:text-gray-700 font-medium transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

function HomeContent() {
  const [allEsimData, setAllEsimData] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);

  // Cargar todos los datos al inicio
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAllEsimData();
        setAllEsimData(data);
      } catch (err) {
        setError('Failed to load eSIM data');
        console.error('Data loading error:', err);
      }
    };

    loadData();
  }, []);

  const handleSearch = async (filters) => {
    if (!allEsimData) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Filtrar en el front-end
      const filteredData = filterEsimData(allEsimData, filters);
      setSearchResults({ 
        ...allEsimData, 
        data: filteredData,
        filters 
      });
    } catch (err) {
      setError('Failed to filter eSIM plans');
      console.error('Filter error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* <Header 
        onSearch={handleSearch} 
        allCountries={allEsimData}
      /> */}
      
      <AnimatePresence mode="wait">
        {!searchResults ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero />
            <BenefitsSection3D />
            <RealPlansSection />
            <TestimonialsSection3D />
            <FinalCTASection3D />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Results 
              results={searchResults} 
              isLoading={isLoading}
              error={error}
              onBack={() => setSearchResults(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Device Compatibility Button */}
      <FloatingDeviceButton onClick={() => setIsDeviceModalOpen(true)} />

      {/* Device Compatibility Modal */}
      <DeviceCompatibilityModal 
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  );
}