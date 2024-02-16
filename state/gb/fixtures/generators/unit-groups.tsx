export type FuelType =
  | "nuclear"
  | "gas"
  | "wind"
  | "battery"
  | "coal"
  | "hydro"
  | "biomass"
  | "oil"
  | "solar"
  | "other";

export type UnitGroup = {
  details: {
    code: string;
    name: string;
    coords: {
      lat: number;
      lng: number;
    };
    fuelType: FuelType;
  };
  units: {
    bmUnit: string;
  }[];
};

export const unitGroups: UnitGroup[] = [
  {
    details: {
      code: "HEYM",
      name: "Heysham",
      coords: {
        lat: 54.0295,
        lng: -2.9149
      },
      fuelType: "nuclear"
    },
    units: [
      {
        bmUnit: "T_HEYM28"
      },
      {
        bmUnit: "T_HEYM12"
      },
      {
        bmUnit: "T_HEYM27"
      },
      {
        bmUnit: "T_HEYM11"
      },
      {
        bmUnit: "T_HEYM2-D"
      }
    ]
  },

  {
    details: {
      code: "TORN",
      name: "Torness",
      coords: {
        lat: 55.96929194350165,
        lng: -2.4061520827496983
      },
      fuelType: "nuclear"
    },
    units: [
      {
        bmUnit: "T_TORN-1"
      },
      {
        bmUnit: "T_TORN-2"
      },
      {
        bmUnit: "T_TORN-D"
      }
    ]
  },

  {
    details: {
      code: "SIZB",
      name: "Sizewell B",
      coords: {
        lat: 52.2123,
        lng: 1.6195
      },
      fuelType: "nuclear"
    },
    units: [
      {
        bmUnit: "T_SIZB-1"
      },
      {
        bmUnit: "T_SIZB-2"
      }
    ]
  },

  {
    details: {
      code: "HRTL",
      name: "Hartlepool",
      coords: {
        lat: 54.6341,
        lng: -1.1801
      },
      fuelType: "nuclear"
    },
    units: [
      {
        bmUnit: "T_HRTL-1"
      },
      {
        bmUnit: "T_HRTL-2"
      }
    ]
  },

  {
    details: {
      code: "PEMB",
      name: "Pembroke",
      coords: {
        lat: 51.68436,
        lng: -4.9968
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_PEMB-11"
      },
      {
        bmUnit: "T_PEMB-21"
      },
      {
        bmUnit: "T_PEMB-31"
      },
      {
        bmUnit: "T_PEMB-41"
      },
      {
        bmUnit: "T_PEMB-51"
      }
    ]
  },

  {
    details: {
      code: "CARR",
      name: "Carrington",
      coords: {
        lat: 53.43772,
        lng: -2.41014
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_CARR-1"
      },
      {
        bmUnit: "T_CARR-2"
      }
    ]
  },

  {
    details: {
      code: "LBAR",
      name: "Little Barford",
      coords: {
        lat: 52.20533,
        lng: -0.2668
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_LBAR-1"
      },
      {
        bmUnit: "T_LBAR-1G"
      }
    ]
  },

  {
    details: {
      code: "SPLN",
      name: "Spalding",
      coords: {
        lat: 52.80721,
        lng: -0.13334
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_SPLN-1"
      },
      {
        bmUnit: "T_SEEL-1"
      }
    ]
  },

  {
    details: {
      code: "DBFRM",
      name: "Down Barn Farm",
      coords: {
        lat: 51.12498309936491,
        lng: -1.7579043828348275
      },
      fuelType: "solar"
    },
    units: [
      {
        bmUnit: "E_DBFRM-1"
      }
    ]
  },

  {
    details: {
      code: "RAKE",
      name: "Rake Lane",
      coords: {
        lat: 53.521311061038254,
        lng: -2.324436034380185
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_RAKE-1"
      }
    ]
  },

  {
    details: {
      code: "MOWEO",
      name: "Moray East",
      coords: {
        lat: 58.188,
        lng: -2.72
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_MOWEO-1"
      },
      {
        bmUnit: "T_MOWEO-2"
      },
      {
        bmUnit: "T_MOWEO-3"
      }
    ]
  },

  {
    details: {
      code: "HOWA",
      name: "Hornsea A",
      coords: {
        lat: 53.88,
        lng: 1.79
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_HOWAO-1"
      },
      {
        bmUnit: "T_HOWAO-2"
      },
      {
        bmUnit: "T_HOWAO-3"
      }
    ]
  },

  {
    details: {
      code: "HOWB",
      name: "Hornsea B",
      coords: {
        lat: 53.95,
        lng: 1.56
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_HOWBO-1"
      },
      {
        bmUnit: "T_HOWBO-2"
      },
      {
        bmUnit: "T_HOWBO-3"
      }
    ]
  },

  {
    details: {
      code: "SGRWO",
      name: "Seagreen",
      coords: {
        lat: 56.6355,
        lng: -1.9266
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_SGRWO-1"
      },
      {
        bmUnit: "T_SGRWO-2"
      },
      {
        bmUnit: "T_SGRWO-3"
      },
      {
        bmUnit: "T_SGRWO-4"
      },
      {
        bmUnit: "T_SGRWO-5"
      },
      {
        bmUnit: "T_SGRWO-6"
      }
    ]
  },

  {
    details: {
      code: "TKN",
      name: "Triton Knoll",
      coords: {
        lat: 53.2123,
        lng: 0.8616
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_TKNEW-1"
      },
      {
        bmUnit: "T_TKNWW-1"
      }
    ]
  },

  {
    details: {
      code: "FAWN",
      name: "Fawley North",
      coords: {
        lat: 50.818,
        lng: -1.329
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_FAWN-1"
      }
    ]
  },

  {
    details: {
      code: "WLNYO",
      name: "Walney",
      coords: {
        lat: 54.0394,
        lng: 3.5158
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_WLNYO-1"
      },
      {
        bmUnit: "T_WLNYO-2"
      },

      {
        bmUnit: "T_WLNYO-3"
      },

      {
        bmUnit: "T_WLNYO-4"
      },
      {
        bmUnit: "T_WLNYW-1"
      }
    ]
  },

  {
    details: {
      code: "CDCL",
      name: "Cottam",
      coords: {
        lat: 53.304757,
        lng: -0.781646
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_CDCL-1"
      }
    ]
  },

  {
    details: {
      code: "CNQPS",
      name: "Connah's Quay",
      coords: {
        lat: 53.2317,
        lng: -3.08149
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_CNQPS-1"
      },
      {
        bmUnit: "T_CNQPS-2"
      },
      {
        bmUnit: "T_CNQPS-3"
      },
      {
        bmUnit: "T_CNQPS-4"
      }
    ]
  },

  {
    details: {
      code: "RATS",
      name: "Ratcliffe",
      coords: {
        lat: 52.866945,
        lng: -1.256635
      },
      fuelType: "coal"
    },
    units: [
      {
        bmUnit: "T_RATS-1"
      },
      {
        bmUnit: "T_RATS-2"
      },
      {
        bmUnit: "T_RATS-3"
      },
      {
        bmUnit: "T_RATS-4"
      },
      {
        bmUnit: "T_RATSGT-2"
      },
      {
        bmUnit: "T_RATSGT-4"
      }
    ]
  },

  {
    details: {
      code: "ROCK",
      name: "Rocksavage",
      coords: {
        lat: 53.31522,
        lng: -2.72278
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_ROCK-1"
      }
    ]
  },

  {
    details: {
      code: "EECL",
      name: "Enfield",
      coords: {
        lat: 51.66248,
        lng: -0.02248
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_EECL-1"
      }
    ]
  },

  {
    details: {
      code: "SHOS",
      name: "Shoreham",
      coords: {
        lat: 50.82992,
        lng: -0.23144
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_SHOS-1"
      }
    ]
  },

  {
    details: {
      code: "SEAB",
      name: "Seabank",
      coords: {
        lat: 51.5392,
        lng: -2.67
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_SEAB-1"
      },
      {
        bmUnit: "T_SEAB-2"
      }
    ]
  },

  {
    details: {
      code: "GRAI",
      name: "Grain",
      coords: {
        lat: 51.44298,
        lng: 0.70782
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_GRAI-6"
      },
      {
        bmUnit: "T_GRAI-7"
      },
      {
        bmUnit: "T_GRAI-8"
      },
      {
        bmUnit: "T_GRAI4G"
      },
      {
        bmUnit: "T_GRAI1G"
      }
    ]
  },

  {
    details: {
      code: "GYAR",
      name: "Great Yarmouth",
      coords: {
        lat: 52.58395,
        lng: 1.73381
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_GYAR-1"
      }
    ]
  },

  {
    details: {
      code: "SCCL",
      name: "Saltend",
      coords: {
        lat: 53.73543,
        lng: -0.24315
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_SCCL-1"
      },
      {
        bmUnit: "T_SCCL-2"
      },
      {
        bmUnit: "T_SCCL-3"
      },
      {
        bmUnit: "T_SCCL-4"
      }
    ]
  },

  {
    details: {
      code: "CHAP",
      name: "Chapel Farm",
      coords: {
        lat: 51.466,
        lng: -0.379
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_CHAPB-1"
      }
    ]
  },

  {
    details: {
      code: "POTE",
      name: "Port of Tyne",
      coords: {
        lat: 54.989,
        lng: -1.455
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_POTES-1"
      }
    ]
  },

  {
    details: {
      code: "KTHRS",
      name: "Keith",
      coords: {
        lat: 57.547,
        lng: -2.956
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "T_KTHRS-1"
      },
      {
        bmUnit: "T_KTHRS-2"
      }
    ]
  },

  {
    details: {
      code: "CAML",
      name: "Camilla",
      coords: {
        lat: 56.116,
        lng: -3.3
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "V__AG-HEL0DN"
      }
    ]
  },

  {
    details: {
      code: "FORD",
      name: "Fordtown",
      coords: {
        lat: 57.229,
        lng: -2.266
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "V__AG-HEL0CP"
      }
    ]
  },

  {
    details: {
      code: "WISH",
      name: "Wishaw Bess",
      coords: {
        lat: 55.777,
        lng: -3.927
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "T_WISHB-1"
      }
    ]
  },

  {
    details: {
      code: "ILME",
      name: "Ilmer Lane",
      coords: {
        lat: 51.644,
        lng: -0.807
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_ILMEB-1"
      }
    ]
  },

  {
    details: {
      code: "LOCK",
      name: "Lockleaze",
      coords: {
        lat: 51.466,
        lng: -0.379
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "2__LRWED001"
      }
    ]
  },

  {
    details: {
      code: "ARNK",
      name: "Blockwich",
      coords: {
        lat: 53.237,
        lng: -2.506
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_ARNKB-1"
      }
    ]
  },

  {
    details: {
      code: "ROOS",
      name: "Roosecote",
      coords: {
        lat: 54.108,
        lng: -3.244
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_ROOSB-1"
      }
    ]
  },

  {
    details: {
      code: "BROF",
      name: "Brook Farm",
      coords: {
        lat: 51.466,
        lng: -0.379
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_BROFB-1"
      }
    ]
  },

  {
    details: {
      code: "MRWD",
      name: "Marchwood",
      coords: {
        lat: 50.89798,
        lng: -1.43751
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_MRWD-1"
      }
    ]
  },

  {
    details: {
      code: "HUMR",
      name: "Immingham",
      coords: {
        lat: 53.63779,
        lng: -0.23674
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_HUMR-1"
      }
    ]
  },

  {
    details: {
      code: "LAGA",
      name: "Langage",
      coords: {
        lat: 50.3872,
        lng: -4.01099
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_LAGA-1"
      }
    ]
  },
  {
    details: {
      code: "DIDC",
      name: "Didcot",
      coords: {
        lat: 51.6246,
        lng: -1.2683
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_DIDCB5"
      },
      {
        bmUnit: "T_DIDCB6"
      },
      {
        bmUnit: "E_DIDC01G"
      },
      {
        bmUnit: "E_DIDC02G"
      },
      {
        bmUnit: "E_DIDC03G"
      },
      {
        bmUnit: "E_DIDC04G"
      }
    ]
  },
  {
    details: {
      code: "DRAX",
      name: "Drax",
      coords: {
        lat: 53.737196,
        lng: -0.999021
      },
      fuelType: "biomass"
    },
    units: [
      {
        bmUnit: "T_DRAXX-1"
      },
      {
        bmUnit: "T_DRAXX-2"
      },
      {
        bmUnit: "T_DRAXX-3"
      },
      {
        bmUnit: "T_DRAXX-4"
      },
      {
        bmUnit: "T_DRAXX-10G"
      },
      {
        bmUnit: "T_DRAXX-9G"
      }
    ]
  },

  {
    details: {
      code: "DAMC",
      name: "Damhead Creek",
      coords: {
        lat: 51.42492,
        lng: 0.60143
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_DAMC-1"
      },
      {
        bmUnit: "T_DAMC-2"
      }
    ]
  },

  {
    details: {
      code: "STAY",
      name: "Staythorpe",
      coords: {
        lat: 53.07368,
        lng: -0.85901
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_STAY-1"
      },
      {
        bmUnit: "T_STAY-2"
      },
      {
        bmUnit: "T_STAY-3"
      },
      {
        bmUnit: "T_STAY-4"
      }
    ]
  },

  {
    details: {
      code: "SHBA",
      name: "South Humber",
      coords: {
        lat: 53.60078,
        lng: -0.14462
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_SHBA-1"
      },
      {
        bmUnit: "T_SHBA-2"
      }
    ]
  },

  {
    details: {
      code: "WBURB",
      name: "West Burton",
      coords: {
        lat: 53.36223,
        lng: -0.80759
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_WBURB-1"
      },
      {
        bmUnit: "T_WBURB-2"
      },
      {
        bmUnit: "T_WBURB-3"
      },
      {
        bmUnit: "T_WBUGT-1"
      },
      {
        bmUnit: "T_WBUGT-4"
      }
    ]
  },

  {
    details: {
      code: "WBURBB",
      name: "West Burton",
      coords: {
        lat: 53.36223,
        lng: -0.80759
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "T_WBURB-41"
      },
      {
        bmUnit: "T_WBURB-43"
      }
    ]
  },

  {
    details: {
      code: "WHLW",
      name: "Whitelee",
      coords: {
        lat: 55.6812,
        lng: -4.2791
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "T_WHLWB-1"
      }
    ]
  },

  {
    details: {
      code: "BARN",
      name: "Hunningly",
      coords: {
        lat: 53.517,
        lng: -1.432
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_BARNB-1"
      }
    ]
  },

  {
    details: {
      code: "GYLA",
      name: "Gypsy Lane",
      coords: {
        lat: 54.581,
        lng: -1.25
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "V_AG-HEL0AG"
      }
    ]
  },

  {
    details: {
      code: "RCBK",
      name: "Race Bank",
      coords: {
        lat: 53.136,
        lng: 0.5892
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_RCBKO-1"
      },
      {
        bmUnit: "T_RCBKO-2"
      }
    ]
  },

  {
    details: {
      code: "KEAD",
      name: "Keadby",
      coords: {
        lat: 53.59444,
        lng: -0.75044
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_KEAD-1"
      },
      {
        bmUnit: "T_KEAD-2"
      },
      {
        bmUnit: "T_KEADGT-2"
      }
    ]
  },

  {
    details: {
      code: "WHILW",
      name: "Whitelee",
      coords: {
        lat: 55.6812,
        lng: -4.2791
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_WHILW-1"
      },
      {
        bmUnit: "T_WHILW-2"
      }
    ]
  },

  {
    details: {
      code: "EAAO",
      name: "East Anglia",
      coords: {
        lat: 52.137,
        lng: 2.1728
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_EAAO-1"
      },
      {
        bmUnit: "T_EAAO-2"
      }
    ]
  },

  {
    details: {
      code: "ERRO",
      name: "Errochty",
      coords: {
        lat: 56.7091,
        lng: -4.0065
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "T_ERRO-1"
      },
      {
        bmUnit: "T_ERRO-2"
      },
      {
        bmUnit: "T_ERRO-3"
      },
      {
        bmUnit: "T_ERRO-4"
      }
    ]
  },

  {
    details: {
      code: "RHEI",
      name: "Rheidol",
      coords: {
        lat: 52.396,
        lng: -3.9
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "E_RHEI-1"
      }
    ]
  },

  {
    details: {
      code: "TILB",
      name: "Tilbury",
      coords: {
        lat: 51.454926,
        lng: 0.391677
      },
      fuelType: "biomass"
    },
    units: [
      {
        bmUnit: "E_TGP1"
      }
    ]
  },

  {
    details: {
      code: "CREA",
      name: "Creag Riabhach",
      coords: {
        lat: 58.21076473583207,
        lng: -4.500526851791008
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_CREAW-1"
      }
    ]
  },

  {
    details: {
      code: "PILL",
      name: "Pillswood",
      coords: {
        lat: 51.464,
        lng: -0.379
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_PILLB-1"
      },
      {
        bmUnit: "E_PILLB-2"
      }
    ]
  },

  {
    details: {
      code: "CONT",
      name: "Contego",
      coords: {
        lat: 50.954,
        lng: -0.142
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_CONTB-1"
      }
    ]
  },

  {
    details: {
      code: "ARBR",
      name: "Arbroath",
      coords: {
        lat: 56.559,
        lng: -2.587
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_ARBRB-1"
      }
    ]
  },

  {
    details: {
      code: "FARN",
      name: "Farnham",
      coords: {
        lat: 51.214,
        lng: -0.802
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_FARNB-1"
      }
    ]
  },

  {
    details: {
      code: "BROA",
      name: "Broadditch",
      coords: {
        lat: 51.399,
        lng: 0.231
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_BROAB-1"
      }
    ]
  },

  {
    details: {
      code: "COVN",
      name: "Coventry",
      coords: {
        lat: 52.421,
        lng: -1.506
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "T_COVNB-1"
      }
    ]
  },

  {
    details: {
      name: "Duddon Sands",
      code: "WDNSO",
      coords: {
        lat: 53.9851,
        lng: -3.462
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_WDNSO-1"
      },
      {
        bmUnit: "T_WDNSO-2"
      }
    ]
  },

  {
    details: {
      code: "WTMSO",
      name: "Westmost Rough",
      coords: {
        lat: 53.81,
        lng: 0.15
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_WTMSO-1"
      }
    ]
  },

  {
    details: {
      code: "LYNE",
      name: "Lynemouth",
      coords: {
        lat: 55.204167,
        lng: -1.520833
      },
      fuelType: "biomass"
    },
    units: [
      {
        bmUnit: "E_LYNE1"
      },
      {
        bmUnit: "E_LYNE2"
      },
      {
        bmUnit: "E_LYNE3"
      }
    ]
  },

  {
    details: {
      code: "SHRSW",
      name: "Sheringham Shoal",
      coords: {
        lat: 53.81,
        lng: 0.15
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_SHRSW-1"
      },
      {
        bmUnit: "T_SHRSW-2"
      }
    ]
  },

  {
    details: {
      code: "GYMR",
      name: "Gwynt y Mor",
      coords: {
        lat: 53.454,
        lng: -3.6266
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_GYMR-15"
      },
      {
        bmUnit: "T_GYMR-17"
      },
      {
        bmUnit: "T_GYMR-26"
      },
      {
        bmUnit: "T_GYMR-28"
      }
    ]
  },

  {
    details: {
      code: "DINO",
      name: "Dinorwig",
      coords: {
        lat: 53.1206,
        lng: -4.1153
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "T_DINO-1"
      },
      {
        bmUnit: "T_DINO-2"
      },
      {
        bmUnit: "T_DINO-3"
      },
      {
        bmUnit: "T_DINO-4"
      },
      {
        bmUnit: "T_DINO-5"
      },
      {
        bmUnit: "T_DINO-6"
      }
    ]
  },

  {
    details: {
      code: "FFES",
      name: "Ffestiniog",
      coords: {
        lat: 52.9808,
        lng: -3.9686
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "T_FFES-1"
      },
      {
        bmUnit: "T_FFES-2"
      },
      {
        bmUnit: "T_FFES-3"
      },
      {
        bmUnit: "T_FFES-4"
      }
    ]
  },

  {
    details: {
      code: "FASN",
      name: "Fasnakyle",
      coords: {
        lat: 57.32586,
        lng: -4.79438
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "T_FASN-1"
      },
      {
        bmUnit: "E_FASN-4"
      },
      {
        bmUnit: "T_FASN-2"
      },
      {
        bmUnit: "E_FASN-3"
      }
    ]
  },

  {
    details: {
      code: "ANRB",
      name: "Aberdeen",
      coords: {
        lat: 57.2225,
        lng: -1.9728
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_ABRBO-1"
      }
    ]
  },

  {
    details: {
      code: "ABRTW",
      name: "Auchrobert",
      coords: {
        lat: 55.624,
        lng: -3.9842
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_ABRTW-1"
      }
    ]
  },

  {
    details: {
      code: "ACHL",
      name: "Achlachan",
      coords: {
        lat: 58.4489,
        lng: -3.4546
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "C__PSMAR001"
      }
    ]
  },

  {
    details: {
      code: "ACHR",
      name: "A`Chruach",
      coords: {
        lat: 56.1528,
        lng: -5.3102
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_ACHRW-1"
      }
    ]
  },

  {
    details: {
      code: "AFTO",
      name: "Afton",
      coords: {
        lat: 55.3116,
        lng: -4.1743
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_AFTOW-1"
      }
    ]
  },

  {
    details: {
      code: "AIRS",
      name: "Airies",
      coords: {
        lat: 54.8021,
        lng: -4.6577
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_AIRSW-1"
      }
    ]
  },

  {
    details: {
      code: "AKGL",
      name: "Aikengall",
      coords: {
        lat: 55.9172,
        lng: -2.4901
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_AKGLW-2"
      },
      {
        bmUnit: "T_AKGLW-3"
      }
    ]
  },

  {
    details: {
      code: "ANSU",
      name: "An Suidhe",
      coords: {
        lat: 56.2187,
        lng: -5.2194
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_ANSUW-1"
      }
    ]
  },

  {
    details: {
      code: "ARCHW",
      name: "Arecleoch",
      coords: {
        lat: 55.0688,
        lng: -4.7971
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_ARCHW-1"
      }
    ]
  },

  {
    details: {
      code: "ASHWW",
      name: "Andershaw",
      coords: {
        lat: 55.5093,
        lng: -3.8463
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_ASHWW-1"
      }
    ]
  },

  {
    details: {
      code: "BABAW",
      name: "Baillie",
      coords: {
        lat: 58.5679,
        lng: -3.677
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_BABAW-1"
      }
    ]
  },

  {
    details: {
      code: "BAGE",
      name: "Baglan Bay",
      coords: {
        lat: 51.61551,
        lng: -3.8346
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_BAGE-1"
      },
      {
        bmUnit: "T_BAGE-2"
      }
    ]
  },

  {
    details: {
      code: "BDCHW",
      name: "Bad A Cheo",
      coords: {
        lat: 58.4205,
        lng: -3.4292
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_BDCHW-1"
      }
    ]
  },

  {
    details: {
      code: "BEATO",
      name: "Beatrice",
      coords: {
        lat: 58.0882,
        lng: -2.9502
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_BEATO-1"
      },
      {
        bmUnit: "T_BEATO-2"
      },
      {
        bmUnit: "T_BEATO-3"
      },
      {
        bmUnit: "T_BEATO-4"
      }
    ]
  },

  {
    details: {
      code: "BEINW",
      name: "Beinneun",
      coords: {
        lat: 57.0956,
        lng: -4.9655
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_BEINW-1"
      }
    ]
  },

  {
    details: {
      code: "BHLAW",
      name: "Bhlaraidh",
      coords: {
        lat: 57.2191,
        lng: -4.5819
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_BHLAW-1"
      }
    ]
  },

  {
    details: {
      code: "BLKWW",
      name: "Blackcraig",
      coords: {
        lat: 55.1199,
        lng: -4.032
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_BLKWW-1"
      }
    ]
  },

  {
    details: {
      code: "CRGTW",
      name: "Craig",
      coords: {
        lat: 55.1199,
        lng: -4.032
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_CRGTW-1"
      }
    ]
  },

  {
    details: {
      code: "LITRB",
      name: "Little Raith",
      coords: {
        lat: 56.143,
        lng: -3.353
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_LITRB-1"
      }
    ]
  },

  {
    details: {
      code: "BLLA",
      name: "Blacklaw",
      coords: {
        lat: 55.766944,
        lng: -3.738889
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_BLLA-1"
      },
      {
        bmUnit: "T_BLLA-2"
      }
    ]
  },

  {
    details: {
      code: "BNWK",
      name: "Burn of Whilk",
      coords: {
        lat: 58.3568,
        lng: -3.2039
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_BNWKW-1"
      }
    ]
  },

  {
    details: {
      code: "BOWL",
      name: "Barrow",
      coords: {
        lat: 53.9915,
        lng: -3.2983
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_BOWLW-1"
      }
    ]
  },

  {
    details: {
      code: "BRBO",
      name: "Burbo",
      coords: {
        lat: 53.4882,
        lng: -3.1849
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_BRBEO-1"
      },
      {
        bmUnit: "E_BURBO"
      }
    ]
  },

  {
    details: {
      code: "BRDU",
      name: "Braes O'Doune",
      coords: {
        lat: 56.2698,
        lng: -4.0589
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_BRDUW-1"
      }
    ]
  },

  {
    details: {
      code: "BRGG",
      name: "Brigg",
      coords: {
        lat: 53.5423,
        lng: -0.5092
      },
      fuelType: "biomass"
    },
    units: [
      {
        bmUnit: "E_BRGG-1"
      }
    ]
  },

  {
    details: {
      code: "BRYB",
      name: "Berry Burn",
      coords: {
        lat: 57.4466,
        lng: -3.4754
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_BRYBW-1"
      }
    ]
  },

  {
    details: {
      code: "BTUIW",
      name: "Beinn an Turic",
      coords: {
        lat: 55.5732,
        lng: -5.5874
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_BTUIW-2"
      },
      {
        bmUnit: "E_BTUIW-3"
      }
    ]
  },

  {
    details: {
      code: "CAIR",
      name: "Cairn Uish",
      coords: {
        lat: 57.5373,
        lng: -3.363
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "2_PPGEN001"
      },
      {
        bmUnit: "2_PPGEN001"
      },
      {
        bmUnit: "2__PSTAT001"
      }
    ]
  },

  {
    details: {
      code: "BEU",
      name: "Beauly",
      coords: {
        lat: 57.47309,
        lng: -4.45938
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "M_CAS-BEU01"
      }
    ]
  },

  {
    details: {
      code: "CLU",
      name: "Clunie",
      coords: {
        lat: 56.71688724042855,
        lng: -3.7780916020120454
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "M_CAS-CLU01"
      }
    ]
  },

  {
    details: {
      code: "CON",
      name: "Conon",
      coords: {
        lat: 57.5746352506808,
        lng: -4.686210732440651
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "M_CAS-CON01"
      }
    ]
  },

  {
    details: {
      code: "GAR",
      name: "Garry",
      coords: {
        lat: 57.070466800000005,
        lng: -5.281377792807345
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "M_CAS-GAR01"
      }
    ]
  },

  {
    details: {
      code: "KIL",
      name: "Killin",
      coords: {
        lat: 56.481,
        lng: -4.298
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "M_CAS-KIL01"
      }
    ]
  },

  {
    details: {
      code: "MOR",
      name: "Moriston",
      coords: {
        lat: 57.1761093185331,
        lng: -4.803003452163473
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "M_CAS-MOR01"
      }
    ]
  },

  {
    details: {
      code: "CGTHW",
      name: "Corriegarth",
      coords: {
        lat: 57.186684969545475,
        lng: -4.366919616037227
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_CGTHW-1"
      }
    ]
  },

  {
    details: {
      code: "CLAC",
      name: "Clachan",
      coords: {
        lat: 56.27744438034275,
        lng: -4.920869168208424
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_CLAC-1"
      }
    ]
  },

  {
    details: {
      code: "T_CLDCW",
      name: "Clyde",
      coords: {
        lat: 55.44612344718645,
        lng: -3.5987094283153507
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_CLDCW-1"
      },
      {
        bmUnit: "T_CLDNW-1"
      },
      {
        bmUnit: "T_CLDSW-1"
      }
    ]
  },

  {
    details: {
      code: "CLDRW",
      name: "Clashindarroch",
      coords: {
        lat: 57.3665,
        lng: -2.8661
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_CLDRW-1"
      }
    ]
  },

  {
    details: {
      code: "CLFLW",
      name: "Clachan flats",
      coords: {
        lat: 56.2881,
        lng: -4.9429
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_CLFLW-1"
      }
    ]
  },

  {
    details: {
      code: "CAM",
      name: "Camster",
      coords: {
        lat: 58.4087,
        lng: -3.2715
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "2_PPGEN003"
      }
    ]
  },

  {
    details: {
      code: "CNCLW",
      name: "Coire na Cloiche",
      coords: {
        lat: 57.7696,
        lng: -4.3732
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_CNCLW-1"
      }
    ]
  },

  {
    details: {
      code: "CORB",
      name: "Corby",
      coords: {
        lat: 52.51044,
        lng: -0.68143
      },
      fuelType: "biomass"
    },
    units: [
      {
        bmUnit: "E_CORB-1"
      }
    ]
  },

  {
    details: {
      code: "COSO",
      name: "Coryton",
      coords: {
        lat: 51.51185,
        lng: 0.5079
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_COSO-1"
      }
    ]
  },

  {
    details: {
      code: "COUWW",
      name: "Cour",
      coords: {
        lat: 55.569361,
        lng: -5.624389
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_COUWW-1"
      }
    ]
  },

  {
    details: {
      code: "COWE",
      name: "Cowes",
      coords: {
        lat: 50.74711,
        lng: -1.2862
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_COWE1"
      },
      {
        bmUnit: "E_COWE2"
      }
    ]
  },

  {
    details: {
      code: "CRDEW",
      name: "Crossdykes",
      coords: {
        lat: 55.1762,
        lng: -3.1729
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_CRDEW-1"
      },
      {
        bmUnit: "T_CRDEW-2"
      },
      {
        bmUnit: "E_CRDEW-1" // T_CRDEW-1
      },
      {
        bmUnit: "E_CRDEW-2"
      }
    ]
  },

  {
    details: {
      code: "CRSS",
      name: "Carnegie Road",
      coords: {
        lat: 55.955,
        lng: -3.193
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_CRSSB-1"
      }
    ]
  },

  {
    details: {
      code: "CUPA",
      name: "Coupar",
      coords: {
        lat: 56.318,
        lng: -3.009
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_CUPAB-1"
      }
    ]
  },

  {
    details: {
      code: "TOLL",
      name: "Tollgate",
      coords: {
        lat: 51.264,
        lng: 1.136
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_TOLLB-1"
      }
    ]
  },

  {
    details: {
      code: "BUST",
      name: "Bustleholme",
      coords: {
        lat: 52.531,
        lng: -2.013
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "T_BUSTB-1"
      }
    ]
  },

  {
    details: {
      code: "COWB",
      name: "Cowley",
      coords: {
        lat: 51.747,
        lng: -1.227
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "T_COWB-1"
      }
    ]
  },

  {
    details: {
      code: "PNYC",
      name: "Pen y Cymoedd",
      coords: {
        lat: 51.747,
        lng: -1.227
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "T_PNYCB-1"
      }
    ]
  },

  {
    details: {
      code: "NURS",
      name: "Nursling",
      coords: {
        lat: 50.921,
        lng: -1.479
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "T_NURSB-1"
      }
    ]
  },

  {
    details: {
      code: "KEMB",
      name: "Kemsley",
      coords: {
        lat: 51.358,
        lng: 0.735
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "T_KEMB-1"
      }
    ]
  },

  {
    details: {
      code: "GRFL",
      name: "Greenfield Road",
      coords: {
        lat: 53.252,
        lng: -3.005
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_GRFLB-1"
      }
    ]
  },

  {
    details: {
      code: "CRGHW",
      name: "Carraig Gheal",
      coords: {
        lat: 56.339,
        lng: -5.2945
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_CRGHW-1"
      }
    ]
  },

  {
    details: {
      code: "CRMLW",
      name: "Corrimoillie",
      coords: {
        lat: 57.667667,
        lng: -4.773333
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_CRMLW-1"
      }
    ]
  },

  {
    details: {
      code: "CRUA",
      name: "Cruachan",
      coords: {
        lat: 56.4192,
        lng: -5.0127
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "T_CRUA-1"
      },
      {
        bmUnit: "T_CRUA-2"
      },
      {
        bmUnit: "T_CRUA-3"
      },
      {
        bmUnit: "T_CRUA-4"
      }
    ]
  },

  {
    details: {
      code: "CRYRW",
      name: "Crystal Rig",
      coords: {
        lat: 55.883,
        lng: -2.5075
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_CRYRW-2"
      },
      {
        bmUnit: "T_CRYRW-3"
      }
    ]
  },

  {
    details: {
      code: "DALSW",
      name: "Dalswinton",
      coords: {
        lat: 55.1841,
        lng: -3.6506
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_DALSW-1"
      }
    ]
  },

  {
    details: {
      code: "DDGNO",
      name: "Dudgeon",
      coords: {
        lat: 53.1175,
        lng: 0.6135
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_DDGNO-1"
      },
      {
        bmUnit: "T_DDGNO-2"
      },
      {
        bmUnit: "T_DDGNO-3"
      },
      {
        bmUnit: "T_DDGNO-4"
      }
    ]
  },

  {
    details: {
      code: "DEEP",
      name: "Deeside",
      coords: {
        lat: 53.233333,
        lng: -3.054722
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_DEEP-1"
      }
    ]
  },

  {
    details: {
      code: "DUNB",
      name: "Dunbar",
      coords: {
        lat: 55.99467893827063,
        lng: -2.5037593767422934
      },
      fuelType: "biomass"
    },
    units: [
      {
        bmUnit: "2__NSMAR001"
      }
    ]
  },

  {
    details: {
      code: "DNLWW",
      name: "Dunlaw",
      coords: {
        lat: 55.805583,
        lng: -2.852889
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_DNLWW-1"
      }
    ]
  },

  {
    details: {
      code: "DOREW",
      name: "Dorenell",
      coords: {
        lat: 57.352722,
        lng: -3.129167
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_DOREW-1"
      },
      {
        bmUnit: "T_DOREW-2"
      }
    ]
  },

  {
    details: {
      code: "DRSLW",
      name: "Dersalloch",
      coords: {
        lat: 55.31925878073858,
        lng: -4.468916566180941
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_DRSLW-1"
      }
    ]
  },

  {
    details: {
      code: "DUNGW",
      name: "Dunmaglass",
      coords: {
        lat: 57.239772263978885,
        lng: -4.267768506763746
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_DUNGW-1"
      }
    ]
  },

  {
    details: {
      code: "BURWB",
      name: "Burwell Weirs",
      coords: {
        lat: 52.272,
        lng: 0.337
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_BURWB-1"
      }
    ]
  },

  {
    details: {
      code: "EDINW",
      name: "Edinbane",
      coords: {
        lat: 57.40959498314662,
        lng: -6.417996723851728
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_EDINW-1"
      }
    ]
  },

  {
    details: {
      code: "EWHLW",
      name: "Ewe Hill",
      coords: {
        lat: 55.115,
        lng: -3.228
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_EWHLW-1"
      }
    ]
  },

  {
    details: {
      code: "FARR",
      name: "Farr",
      coords: {
        lat: 57.325264293976204,
        lng: -4.092302940312459
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_FARR-1"
      },
      {
        bmUnit: "T_FARR-2"
      }
    ]
  },

  {
    details: {
      code: "GFLDW",
      name: "Goole Fields",
      coords: {
        lat: 53.7167,
        lng: -0.9333
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_GFLDW-1"
      }
    ]
  },

  {
    details: {
      code: "CASKD",
      name: "Castner Kellner",
      coords: {
        lat: 53.329417,
        lng: -2.754083
      },
      fuelType: "biomass"
    },
    units: [
      {
        bmUnit: "T_CASKD-1"
      }
    ]
  },

  {
    details: {
      code: "GLNKW",
      name: "Glen Kyllachy",
      coords: {
        lat: 57.334806,
        lng: -4.104861
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_GLNKW-1"
      }
    ]
  },

  {
    details: {
      code: "DOLLB",
      name: "Dollymans",
      coords: {
        lat: 51.589,
        lng: 0.564
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_DOLLB-1"
      }
    ]
  },

  {
    details: {
      code: "BETHW",
      name: "BheBeinn Tharsuinn",
      coords: {
        lat: 57.8015,
        lng: -4.3314
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_BETHW-1"
      }
    ]
  },

  {
    details: {
      code: "FALGW",
      name: "Fallago",
      coords: {
        lat: 55.82489777951005,
        lng: -2.66409699462629
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_FALGW-1"
      }
    ]
  },

  {
    details: {
      code: "FELL",
      name: "Fellside",
      coords: {
        lat: 50.83,
        lng: -1.35
      },
      fuelType: "biomass"
    },
    units: [
      {
        bmUnit: "E_FELL-1"
      }
    ]
  },

  {
    details: {
      code: "FINL",
      name: "Finlarig",
      coords: {
        lat: 56.28,
        lng: -3.61
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "T_FINL-1"
      }
    ]
  },

  {
    details: {
      code: "FOYE",
      name: "Foyers",
      coords: {
        lat: 57.24,
        lng: -4.36
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "T_FOYE-1"
      },
      {
        bmUnit: "T_FOYE-2"
      }
    ]
  },

  {
    details: {
      code: "FSDLW",
      name: "Freasdail",
      coords: {
        lat: 55.78,
        lng: -5.48
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_FSDLW-1"
      }
    ]
  },

  {
    details: {
      code: "GANW",
      name: "Galloper",
      coords: {
        lat: 51.89,
        lng: 2.04
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_GANW-11"
      },
      {
        bmUnit: "T_GANW-13"
      },
      {
        bmUnit: "T_GANW-22"
      },
      {
        bmUnit: "T_GANW-24"
      }
    ]
  },

  {
    details: {
      code: "DBAWO",
      name: "Dogger Bank",
      coords: {
        lat: 54.1,
        lng: 2.5
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_DBAWO-1"
      },
      {
        bmUnit: "T_DBAWO-2"
      },
      {
        bmUnit: "T_DBAWO-3"
      },
      {
        bmUnit: "T_DBAWO-4"
      },
      {
        bmUnit: "T_DBAWO-5"
      }
    ]
  },

  {
    details: {
      code: "CUMHW",
      name: "Cumberhead",
      coords: {
        lat: 55.6,
        lng: -3.9
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_CUMHW-1"
      }
    ]
  },

  {
    details: {
      code: "ASLVW",
      name: "Assel Valley",
      coords: {
        lat: 55.226333,
        lng: -4.7715
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_ASLVW-1"
      }
    ]
  },

  {
    details: {
      code: "GDSTW",
      name: "Gordonstoun",
      coords: {
        lat: 57.448389,
        lng: -2.4745
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_GDSTW-1"
      }
    ]
  },

  {
    details: {
      code: "GLCHW",
      name: "Glenchamber",
      coords: {
        lat: 54.96,
        lng: -4.75
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_GLCHW-1"
      }
    ]
  },

  {
    details: {
      code: "GLNDO",
      name: "Glendoe",
      coords: {
        lat: 57.15,
        lng: -5.17
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "T_GLNDO-1"
      }
    ]
  },

  {
    details: {
      code: "GLOFW",
      name: "Glens of Foudland",
      coords: {
        lat: 57.22,
        lng: -2.88
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_GLOFW-1"
      }
    ]
  },

  {
    details: {
      code: "GLWSW",
      name: "Galawhistle",
      coords: {
        lat: 55.53,
        lng: -3.92
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_GLWSW-1"
      }
    ]
  },

  {
    details: {
      code: "GNAPW",
      name: "Glen App",
      coords: {
        lat: 55.02,
        lng: -5.03
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_GNAPW-1"
      }
    ]
  },

  {
    details: {
      code: "GNFSW",
      name: "Gunfleet Sands",
      coords: {
        lat: 51.74,
        lng: 1.17
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_GNFSW-1"
      },
      {
        bmUnit: "E_GNFSW-2"
      },
      {
        bmUnit: "T_GNFSW-2"
      }
    ]
  },

  {
    details: {
      code: "GORDW",
      name: "Gordonbush",
      coords: {
        lat: 58.07153332938159,
        lng: -3.991809012205654
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_GORDW-1"
      },
      {
        bmUnit: "T_GORDW-2"
      }
    ]
  },

  {
    details: {
      code: "GRGBW",
      name: "Greater Gabbard",
      coords: {
        lat: 51.86649367222777,
        lng: 1.9277117027817146
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_GRGBW-1"
      },
      {
        bmUnit: "T_GRGBW-2"
      },
      {
        bmUnit: "T_GRGBW-3"
      }
    ]
  },

  {
    details: {
      code: "GRIFW",
      name: "Griffin",
      coords: {
        lat: 56.53,
        lng: -3.39
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_GRIFW-1"
      },
      {
        bmUnit: "T_GRIFW-2"
      }
    ]
  },

  {
    details: {
      code: "GRMO",
      name: "Grangemouth",
      coords: {
        lat: 56.02,
        lng: -3.73
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_GRMO-1"
      }
    ]
  },

  {
    details: {
      code: "HALSW",
      name: "Halsary",
      coords: {
        lat: 58.44652833288308,
        lng: -3.4208646140957404
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_HALSW-1"
      }
    ]
  },

  {
    details: {
      code: "HBHDW",
      name: "Harburnhead",
      coords: {
        lat: 55.814764307994125,
        lng: -3.54231733790513
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_HBHDW-1"
      }
    ]
  },

  {
    details: {
      code: "HLGLW",
      name: "Hill of Glaschyle",
      coords: {
        lat: 57.51,
        lng: -3.62
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_HLGLW-1"
      }
    ]
  },
  {
    details: {
      code: "HLTWW",
      name: "Hill of Towie",
      coords: {
        lat: 57.49,
        lng: -2.41
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_HLTWW-1"
      }
    ]
  },
  {
    details: {
      code: "HMGTO",
      name: "Humber Gateway",
      coords: {
        lat: 53.65936008605068,
        lng: 0.29528252560843476
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_HMGTO-1"
      },
      {
        bmUnit: "T_HMGTO-2"
      }
    ]
  },
  {
    details: {
      code: "HRHLW",
      name: "Hare Hill",
      coords: {
        lat: 55.36726941867161,
        lng: -4.1089394055798705
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_HRHLW-1"
      }
    ]
  },

  {
    details: {
      code: "HRSTW",
      name: "Harestanes",
      coords: {
        lat: 55.37438774601089,
        lng: -3.9614870161241624
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_HRSTW-1"
      }
    ]
  },

  {
    details: {
      code: "HYWDW",
      name: "Hywind",
      coords: {
        lat: 57.48,
        lng: -1.35
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_HYWDW-1"
      }
    ]
  },

  {
    details: {
      code: "INDQ",
      name: "Indian Queens",
      coords: {
        lat: 50.39636444053638,
        lng: -4.898096864753528
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_INDQ-1"
      }
    ]
  },

  {
    details: {
      code: "JGPR",
      name: "JG Pears",
      coords: {
        lat: 51.74,
        lng: -3.07
      },
      fuelType: "biomass"
    },
    units: [
      {
        bmUnit: "T_JGPR-1"
      }
    ]
  },

  {
    details: {
      code: "KILBW",
      name: "Kilbraur",
      coords: {
        lat: 58.04,
        lng: -4.06
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_KILBW-1"
      }
    ]
  },

  {
    details: {
      code: "HOLB",
      name: "Holes Bay",
      coords: {
        lat: 50.723,
        lng: -2.016
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "BHOLB-1"
      }
    ]
  },

  {
    details: {
      code: "KILLPG",
      name: "Killingholme",
      coords: {
        lat: 53.65419,
        lng: -0.25518
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_KILLPG-1"
      },
      {
        bmUnit: "T_KILLPG-2"
      },
      {
        bmUnit: "T_KILNS-1"
      }
    ]
  },

  {
    details: {
      code: "KINCW",
      name: "Kincardine",
      coords: {
        lat: 56.98,
        lng: 1.88
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_KINCW-1"
      }
    ]
  },

  {
    details: {
      code: "KLGLW",
      name: "Kilgallioch",
      coords: {
        lat: 55.049912278136496,
        lng: -4.764493574079205
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_KLGLW-1"
      }
    ]
  },

  {
    details: {
      code: "KLYN",
      name: "Kings Lynn",
      coords: {
        lat: 52.72750854417357,
        lng: 0.38092497060502656
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_KLYN-A-1"
      }
    ]
  },
  {
    details: {
      code: "KPMRW",
      name: "Kype Muir",
      coords: {
        lat: 55.62896285665657,
        lng: -4.061570179294071
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_KPMRW-1"
      },
      {
        bmUnit: "T_KYPEW-1"
      }
    ]
  },

  {
    details: {
      code: "KTHLW",
      name: "Keith Hill",
      coords: {
        lat: 55.82,
        lng: 2.83
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_KTHLW-1"
      }
    ]
  },

  {
    details: {
      code: "LARYW",
      name: "London Array",
      coords: {
        lat: 51.65,
        lng: 1.36
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_LARYW-1"
      },
      {
        bmUnit: "T_LARYW-2"
      },
      {
        bmUnit: "T_LARYW-3"
      },
      {
        bmUnit: "T_LARYW-4"
      }
    ]
  },

  {
    details: {
      code: "LCLTW",
      name: "Lochluichart",
      coords: {
        lat: 57.74,
        lng: -4.56
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_LCLTW-1"
      }
    ]
  },
  {
    details: {
      code: "LNCSW",
      name: "Lincs",
      coords: {
        lat: 53.1519564550017,
        lng: 0.5274637683028764
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_LNCSW-1"
      },
      {
        bmUnit: "T_LNCSW-2"
      }
    ]
  },
  {
    details: {
      code: "MARK",
      name: "Markinch",
      coords: {
        lat: 56.200423605026515,
        lng: -3.1567815618346255
      },
      fuelType: "biomass"
    },
    units: [
      {
        bmUnit: "E_MARK-1"
      }
    ]
  },

  {
    details: {
      code: "MIDH",
      name: "Mid Hill",
      coords: {
        lat: 56.96,
        lng: -2.48
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "2__PSTAT002"
      }
    ]
  },

  {
    details: {
      code: "WTRLN",
      name: "Water Lane",
      coords: {
        lat: 50.70804436952977,
        lng: -3.5209000751934574
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_WTRLN-1"
      }
    ]
  },

  {
    details: {
      code: "MEDP",
      name: "Medway",
      coords: {
        lat: 51.38,
        lng: 0.89
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_MEDP-1"
      }
    ]
  },

  {
    details: {
      code: "MORFL",
      name: "Moorfield Drive",
      coords: {
        lat: 53.7758,
        lng: -2.36467
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_MORFL-1"
      }
    ]
  },

  {
    details: {
      code: "BSPHM",
      name: "Bispham",
      coords: {
        lat: 53.8493407416543,
        lng: -3.0325663339413875
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E-BSPHM-1"
      }
    ]
  },

  {
    details: {
      code: "MDLWH",
      name: "Middlewich",
      coords: {
        lat: 53.18726,
        lng: -2.42461
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_MDLWH-1"
      }
    ]
  },

  {
    details: {
      code: "MIDMW",
      name: "Middle Muir",
      coords: {
        lat: 55.514378415866375,
        lng: -3.803041190703463
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_MIDMW-1"
      }
    ]
  },

  {
    details: {
      code: "MILWW",
      name: "Millennium",
      coords: {
        lat: 57.12374520636007,
        lng: -4.845656718900648
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_MILWW-1"
      }
    ]
  },

  {
    details: {
      code: "MINSW",
      name: "Minsca",
      coords: {
        lat: 55.04,
        lng: -3.47
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_MINSW-1"
      }
    ]
  },

  {
    details: {
      code: "MKHLW",
      name: "Mark Hill",
      coords: {
        lat: 55.16,
        lng: 4.82
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_MKHLW-1"
      }
    ]
  },

  {
    details: {
      code: "MOYEW",
      name: "Moy",
      coords: {
        lat: 57.39,
        lng: -4.06
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_MOYEW-1"
      }
    ]
  },

  {
    details: {
      code: "MYGPW",
      name: "Minnygap",
      coords: {
        lat: 55.25,
        lng: -3.51
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_MYGPW-1"
      }
    ]
  },
  {
    details: {
      code: "NANT",
      name: "Nant",
      coords: {
        lat: 56.33791021804411,
        lng: -5.211113121758361
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "T_NANT-1"
      }
    ]
  },

  {
    details: {
      code: "OMNDW",
      name: "Ormonde",
      coords: {
        lat: 54.1,
        lng: -3.4
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_OMNDW-1"
      }
    ]
  },
  {
    details: {
      code: "PHABL",
      name: "Pauls' Hill",
      coords: {
        lat: 57.45,
        lng: -3.46
      },
      fuelType: "biomass"
    },
    units: [
      {
        bmUnit: "2_PPGEN002"
      }
    ]
  },

  {
    details: {
      code: "PEHE",
      name: "Peterhead",
      coords: {
        lat: 57.48,
        lng: -1.87
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_PEHE-1"
      }
    ]
  },

  {
    details: {
      code: "PETEM1",
      name: "Peterborough",
      coords: {
        lat: 52.58,
        lng: -0.2
      },
      fuelType: "biomass"
    },
    units: [
      {
        bmUnit: "E_PETEM1"
      }
    ]
  },
  {
    details: {
      code: "PGBIW",
      name: "Pogbie",
      coords: {
        lat: 55.8551,
        lng: -2.8648
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_PGBIW-1"
      }
    ]
  },
  {
    details: {
      code: "PNYCW",
      name: "Pen y Cymoedd",
      coords: {
        lat: 51.70973149497483,
        lng: -3.5864877520574443
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_PNYCW-1"
      }
    ]
  },

  {
    details: {
      code: "REDGT",
      name: "Redditch",
      coords: {
        lat: 52.3,
        lng: -1.93
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_REDGT-1"
      }
    ]
  },

  {
    details: {
      code: "RMPNO",
      name: "Rampion",
      coords: {
        lat: 50.67,
        lng: 0.27
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_RMPNO-1"
      },
      {
        bmUnit: "T_RMPNO-2"
      }
    ]
  },

  {
    details: {
      code: "RREW",
      name: "Robin Rigg",
      coords: {
        lat: 54.75,
        lng: -3.72
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_RREW-1"
      },
      {
        bmUnit: "T_RRWW-1"
      }
    ]
  },

  {
    details: {
      code: "RSHLW",
      name: "Rosehall",
      coords: {
        lat: 57.981691487181486,
        lng: -4.4977128370244905
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_RSHLW-1"
      }
    ]
  },
  {
    details: {
      code: "RYHPS",
      name: "Rye House",
      coords: {
        lat: 51.763,
        lng: 0.009
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_RYHPS-1"
      }
    ]
  },

  {
    details: {
      code: "SANQW",
      name: "Sanquhar",
      coords: {
        lat: 55.3457579610213,
        lng: -4.0249049858595045
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_SANQW-1"
      }
    ]
  },

  {
    details: {
      code: "SLOY",
      name: "Sloy",
      coords: {
        lat: 56.2,
        lng: -4.74
      },
      fuelType: "hydro"
    },
    units: [
      {
        bmUnit: "M_SLOY-1"
      },
      {
        bmUnit: "T_SLOY-2"
      },
      {
        bmUnit: "T_SLOY-3"
      },
      {
        bmUnit: "M_SLOY-4"
      }
    ]
  },

  {
    details: {
      code: "STLGW",
      name: "Stronelairg",
      coords: {
        lat: 57.1,
        lng: -4.46
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_STLGW-1"
      },
      {
        bmUnit: "T_STLGW-2"
      },
      {
        bmUnit: "T_STLGW-3"
      }
    ]
  },

  {
    details: {
      code: "STRNW",
      name: "Stathy North",
      coords: {
        lat: 58.510179108214274,
        lng: -4.021163500770599
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_STRNW-1"
      }
    ]
  },

  // sutton bridge 0.10 52.62

  {
    details: {
      code: "SUTB",
      name: "Sutton Bridge",
      coords: {
        lat: 52.62,
        lng: 0.1
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_SUTB-1"
      }
    ]
  },

  // Severn Power 3.07 51.74 T_SVRP-10 T_SVRP-20

  {
    details: {
      code: "SVRP",
      name: "Severn Power",
      coords: {
        lat: 51.74,
        lng: -3.07
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_SVRP-10"
      },
      {
        bmUnit: "T_SVRP-20"
      }
    ]
  },

  //   Taylors Lane	E_TAYL2G 	E_TAYL3G -0.26 51.55

  {
    details: {
      code: "TAYL",
      name: "Taylors Lane",
      coords: {
        lat: 51.55,
        lng: -0.26
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_TAYL2G"
      },
      {
        bmUnit: "E_TAYL3G"
      }
    ]
  },

  // Toddleburn	T_TDBNW-1 -2.53 53.27

  {
    details: {
      code: "TDBNW",
      name: "Toddleburn",
      coords: {
        lat: 55.77346477505817,
        lng: -2.8698050803142077
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_TDBNW-1"
      }
    ]
  },
  // Thanet Offshore Wind	T_THNTO-1 	T_THNTO-2 1.46 51.39

  {
    details: {
      code: "THNTO",
      name: "Thanet",
      coords: {
        lat: 51.39,
        lng: 1.46
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_THNTO-1"
      },
      {
        bmUnit: "T_THNTO-2"
      }
    ]
  },

  // Tullymurdoch	E_TLYMW-1 -3.29 56.67

  {
    details: {
      code: "TLYMW",
      name: "Tullymurdoch",
      coords: {
        lat: 56.67,
        lng: -3.29
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_TLYMW-1"
      }
    ]
  },

  // Tralorg	T_TRLGW-1 -2.53 53.27

  {
    details: {
      code: "TRLGW",
      name: "Tralorg",
      coords: {
        lat: 55.2497,
        lng: -4.80797
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_TRLGW-1"
      }
    ]
  },
  {
    details: {
      code: "TSREP",
      name: "MGT Teesside",
      coords: {
        lat: 54.5975,
        lng: -1.1703
      },
      fuelType: "biomass"
    },
    units: [
      {
        bmUnit: "T_TSREP-1"
      }
    ]
  },
  {
    details: {
      code: "TULWW",
      name: "Tullo",
      coords: {
        lat: 56.83392741448257,
        lng: -2.392349391051705
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_TULWW-1"
      },
      {
        bmUnit: "E_TULWW-2"
      }
    ]
  },
  // twent T_TWSHW-1 -3.92 55.32

  {
    details: {
      code: "TWENT",
      name: "Twent",
      coords: {
        lat: 55.32,
        lng: -3.92
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_TWSHW-1"
      }
    ]
  },
  {
    details: {
      name: "Windy Rig",
      code: "T_WDRGW-1",
      coords: {
        lat: 55.27475,
        lng: -4.1795
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_WDRGW-1"
      }
    ]
  },

  // Whiteside Hill T_WHIHW-1 -2.53 53.27

  {
    details: {
      code: "WHIHW",
      name: "Whiteside Hill",
      coords: {
        lat: 55.3575,
        lng: -4.0313
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_WHIHW-1"
      },
      {
        bmUnit: "T_WHIHW-2"
      }
    ]
  },
  {
    details: {
      code: "WILCT",
      name: "Wilton",
      coords: {
        lat: 54.5894,
        lng: -1.1185
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "T_WILCT-1"
      }
    ]
  },

  // E_WINN-1 Winnington -2.53	53.27

  {
    details: {
      code: "WINN",
      name: "Winnington",
      coords: {
        lat: 53.26702,
        lng: -2.53098
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_WINN-1"
      }
    ]
  },

  {
    details: {
      code: "WISTW",
      name: "Windy Standard II",
      coords: {
        lat: 55.27,
        lng: -4.18
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_WISTW-2"
      }
    ]
  },
  // {
  //   details: {
  //     code: "WTGRW",
  //     name: "Wethergar",
  //     coords: {
  //       lat: 53.27,
  //       lng: 2.53,
  //     },
  //     fuelType: "wind",
  //   },
  //   units: [
  //     {
  //       bmUnit: "T_WTGRW-1",
  //     },
  //   ],
  // },
  {
    details: {
      code: "DERB",
      name: "Derby",
      coords: {
        lat: 52.92,
        lng: -1.5
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_DERBY-1"
      }
    ]
  },
  {
    details: {
      code: "THMRB",
      name: "Thame Road",
      coords: {
        lat: 51.63,
        lng: -1.07
      },

      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_THMRB-1"
      }
    ]
  },
  {
    details: {
      code: "SOKYW",
      name: "South Kyle",
      coords: {
        lat: 55.329817522785824,
        lng: -4.341610700916734
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_SOKYW-1"
      }
    ]
  },

  //Kennoxhead T_KENNW-1 55.49831806503957, -3.9137355183118387

  {
    details: {
      code: "KENNW",
      name: "Kennoxhead",
      coords: {
        lat: 55.49831806503957,
        lng: -3.9137355183118387
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_KENNW-1"
      }
    ]
  },

  // Pinfold

  {
    details: {
      code: "PINF",
      name: "Capenhurst",
      coords: {
        lat: 53.26596802790049,
        lng: -2.941941529015923
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "T_PINFB-1"
      },
      {
        bmUnit: "T_PINFB-2"
      },
      {
        bmUnit: "T_PINFB-3"
      },
      {
        bmUnit: "T_PINFB-4"
      },
      {
        bmUnit: "T_PINFD-5"
      },
      {
        bmUnit: "T_PINFD-6"
      }
    ]
  },

  // Hutton Battery E_ARNKB-2

  {
    details: {
      code: "ARNKB",
      name: "Hutton Battery",
      coords: {
        lat: 55.884,
        lng: -3.922
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_ARNKB-2"
      }
    ]
  },

  // Greengairs east wind farm

  {
    details: {
      code: "GGRSW",
      name: "Greengairs East",
      coords: {
        lat: 55.884,
        lng: -3.922
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_GRGRW-1"
      }
    ]
  },
  {
    details: {
      code: "BLARW",
      name: "Blary Hill",
      coords: {
        lat: 55.884,
        lng: -3.922
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "E_BLARW-1"
      }
    ]
  },

  {
    details: {
      code: "DALQW",
      name: "Dalquhandy",
      coords: {
        lat: 55.884,
        lng: -3.922
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_DALQW-1"
      }
    ]
  },

  {
    details: {
      code: "SAKNW",
      name: "Sandy Knowe",
      coords: {
        lat: 55.884,
        lng: -3.922
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_SAKNW-1"
      }
    ]
  },

  {
    details: {
      code: "SKELB",
      name: "Skelmersdale",
      coords: {
        lat: 53.55,
        lng: -2.8
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_SKELB-1"
      }
    ]
  },

  {
    details: {
      code: "CLAYB",
      name: "Clay Tye",
      coords: {
        lat: 51.97,
        lng: 0.74
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_CLAYB-2"
      },
      {
        bmUnit: "E_CLAYB-1"
      }
    ]
  },

  {
    details: {
      code: "DOUGW",
      name: "Douglas West",
      coords: {
        lat: 55.57481257534265,
        lng: -3.8527474924568645
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_DOUGW-1"
      }
    ]
  },

  {
    details: {
      code: "HAADHW",
      name: "Hadyard Hill",
      coords: {
        lat: 55.57481257534265,
        lng: -3.8527474924568645
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_HADHW-1"
      }
    ]
  },

  {
    details: {
      code: "LARKS",
      name: "Larks Green",
      coords: {
        lat: 51.580335192168,
        lng: -2.488009122311269
      },
      fuelType: "solar"
    },
    units: [
      {
        bmUnit: "T_LARKS-1"
      }
    ]
  },

  {
    details: {
      code: "PEDGE",
      name: "Rosehall",
      coords: {
        lat: 58.003537,
        lng: -4.55391
      },
      fuelType: "wind"
    },

    units: [
      {
        bmUnit: "2__PEDGE004"
      }
    ]
  },
  {
    details: {
      code: "PSTAT",
      name: "Tomnanclach",
      coords: {
        lat: 57.39224368803747,
        lng: -3.8940041371091225
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "C__PSTAT011"
      }
    ]
  },

  {
    details: {
      code: "RICHB",
      name: "Richborough",
      coords: {
        lat: 51.31179445054598,
        lng: 1.3483102242965337
      },
      fuelType: "battery"
    },

    units: [
      {
        bmUnit: "T_RICHB-1"
      },
      {
        bmUnit: "T_RICHB-2"
      }
    ]
  },
  {
    details: {
      code: "CROYD",
      name: "Croydon",
      coords: {
        lat: 51.3788,
        lng: -0.1211
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_CROYD-2"
      }
    ]
  },
  {
    details: {
      code: "CHICK",
      name: "Chickerell",
      coords: {
        lat: 53.27,
        lng: -2.53
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_CHICK-1"
      }
    ]
  },
  {
    details: {
      code: "EXETR",
      name: "Exeter",
      coords: {
        lat: 50.7067,
        lng: -3.5244
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_EXETR-2"
      }
    ]
  },
  {
    details: {
      code: "PGEXTR",
      name: "Exeter",
      coords: {
        lat: 50.7067,
        lng: -3.5244
      },
      fuelType: "oil"
    },
    units: [
      {
        bmUnit: "E_PGEXTR"
      }
    ]
  },
  {
    details: {
      code: "THRNL",
      name: "Thornhill",
      coords: {
        lat: 53.677222,
        lng: -1.654722
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_THRNL-1"
      }
    ]
  },
  {
    details: {
      code: "SUDME",
      name: "Sudmeadow",
      coords: {
        lat: 51.86506,
        lng: -2.26379
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_SUDME-1"
      }
    ]
  },
  {
    details: {
      code: "RDSCR",
      name: "Redscar",
      coords: {
        lat: 53.78285876623803,
        lng: -2.6389794927155616
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_RDSCR-1"
      }
    ]
  },
  {
    details: {
      code: "ALCOA",
      name: "Alcoa",
      coords: {
        lat: 51.64929477115635,
        lng: -4.0143616171303105
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_ALCOA-1"
      }
    ]
  },
  {
    details: {
      code: "JAMB",
      name: "Jamesfield",
      coords: {
        lat: 56.341884708051374,
        lng: -3.288748040697988
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_JAMBB-1"
      }
    ]
  },
  {
    details: {
      code: "CHTRY",
      name: "Chatterly",
      coords: {
        lat: 53.07673,
        lng: -2.17748
      },
      fuelType: "oil"
    },
    units: [
      {
        bmUnit: "E_CHTRY-1"
      }
    ]
  },

  {
    details: {
      code: "GOSHS",
      name: "Goose House",
      coords: {
        lat: 53.70736,
        lng: -2.46825
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_GOSHS-1"
      }
    ]
  },
  {
    details: {
      code: "BURWS",
      name: "Burwell/Beechgreen",
      coords: {
        lat: 52.29019358783335,
        lng: 0.31888643552728213
      },
      fuelType: "solar"
    },
    units: [
      {
        bmUnit: "T_BURWS-1"
      }
    ]
  },
  {
    details: {
      code: "BROCW",
      name: "Brokencross",
      coords: {
        lat: 55.6045,
        lng: -3.8162
      },
      fuelType: "wind"
    },
    units: [
      {
        bmUnit: "T_BROCW-1"
      }
    ]
  },
  {
    details: {
      code: "FDUN",
      name: "Fort Dunlop",
      coords: {
        lat: 52.510192278466555,
        lng: -1.8084489366392935
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_FDUN-1"
      }
    ]
  },
  {
    details: {
      code: "HAWKB",
      name: "Hawkers Hill",
      coords: {
        lat: 51.014049506673544,
        lng: -2.2062949110986945
      },
      fuelType: "battery"
    },
    units: [
      {
        bmUnit: "E_HAWKB-1"
      }
    ]
  },
  {
    details: {
      code: "BSPHM",
      name: "Bispham",
      coords: {
        lat: 53.84937,
        lng: -3.02964
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_BSPHM-1"
      }
    ]
  },
  {
    details: {
      code: "ABERDARE",
      name: "Aberdare",
      coords: {
        lat: 51.697580592208915,
        lng: -3.416172490484192
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_ABERDARE"
      }
    ]
  },
  {
    details: {
      code: "SOLUTIA",
      name: "Solutia",
      coords: {
        lat: 51.59,
        lng: -3.0
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_SOLUTIA"
      }
    ]
  },
  {
    details: {
      code: "RDFRD",
      name: "Redfield Road Farm",
      coords: {
        lat: 52.93468,
        lng: -1.17903
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_RDFRD-1"
      },
      {
        bmUnit: "E_RDFRB-1"
      }
    ]
  },
  {
    details: {
      code: "LECHW",
      name: "Letchworth",
      coords: {
        lat: 51.98,
        lng: -0.2
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_LCHWT-1"
      }
    ]
  },
  {
    details: {
      code: "LSTWY",
      name: "Lester Way",
      coords: {
        lat: 51.59621432117479,
        lng: -1.1401863740917435
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_LSTWY-1"
      }
    ]
  },
  {
    details: {
      code: "TRFPK",
      name: "Trafalgar Park",
      coords: {
        lat: 52.89172,
        lng: -1.47466
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_TRFPK-1"
      }
    ]
  },
  {
    details: {
      code: "SEVINGTN",
      name: "Sevington",
      coords: {
        lat: 51.13,
        lng: 0.91
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_SEVINGTN"
      }
    ]
  },
  {
    details: {
      code: "BRIDGWTR",
      name: "Bridgewater",
      coords: {
        lat: 51.13,
        lng: 0.91
      },
      fuelType: "gas"
    },
    units: [
      {
        bmUnit: "E_BRIDGWTR"
      }
    ]
  }
];

/* used in the aggregation of live generation by fuel type */

export const bmUnitFuelType: Record<string, string> = {};
for (const ug of unitGroups) {
  for (const unit of ug.units) {
    bmUnitFuelType[unit.bmUnit] = ug.details.fuelType;
  }
}

export const unitGroupNameFuelTypes = {};
for (const ug of unitGroups) {
  unitGroupNameFuelTypes[ug.details.code] = {
    name: ug.details.name,
    fuelType: ug.details.fuelType
  };
}

export const knownGeneratorBmUnits = new Set(Object.keys(bmUnitFuelType));

export const isKnownGeneratorBmUnit = (bmUnit: string) =>
  knownGeneratorBmUnits.has(bmUnit);

// map icons

export const filterUnitsByType = (fuelType: FuelType) =>
  unitGroups.filter((ug) => ug.details.fuelType === fuelType);

export const unitGroupCodes: string[] = [];
for (const ug of unitGroups) {
  unitGroupCodes.push(ug.details.code);
}

export type UnitGroupBmUnits = {
  unitGroupCode: string;
  bmUnits: string[];
};

export const unitGroupBmUnits = unitGroups.map((ug) => {
  return {
    unitGroupCode: ug.details.code,
    bmUnits: ug.units.map((u) => u.bmUnit)
  };
}) as UnitGroupBmUnits[];

export const bmUnits = unitGroups.flatMap((ug) =>
  ug.units.map((u) => u.bmUnit)
);
