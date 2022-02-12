var gajdViewer = {
    _mapCanvasId: null,
    _conditionContainerId: null,
    _dataExportContainerId: null,
    _legendContainerId: null,
    _map: null, //holds the google map object
    _mapOptions: null,
    _styles: null,
    _lastValidCenter: null,
    _allowedBounds: null,
    _geocoder: null,

    
    mapData: [], //This will hold the data for each GAJD map as each one is loaded on an as-needed basis.
    //gajdMapsGraphed: [], // This behaves as a hash of mapNo's as keys and arrays of integers representing dataSetNo's as values
    dataSets: [],   //This holds all the locations in each data set.
                    //Each data set is an associative array with locations numbers as keys and
                    //arrays of objects for each map response (properties: mapNo, hwNo, prnNo, rsp, noteCode, note)
    conditionsForDataSets: [], // This holds all the conditions used for each data set.
    overlaysForDataSets: [], // This holds arrays of all the overlays shown on the map for each dataSet.
    markerOpacity: 0.4, //The default opacity for markers put on the map
    
    GAJ_MESH_CELL_WIDTH: 90/3600,  //width (in degrees longitude) of a cell in the mesh used to assign GAJ location codes
    GAJ_MESH_CELL_HEIGHT: 1/60 //height (in degrees latitude) of a cell in the mesh used to assign GAJ location codes
}

// gajdViewer.mapNameList holds an array of objects representing a list of all the maps for
// purposes of displaying them in a menu to select a map for a condition.
// Each entry in the list is represented by an object of the structure {colNo:integer, mapNo:integer, qNo:string, qWord:string}
// The index of each element in the array is equal to mapNo-1.
gajdViewer.mapNameList = [
    {
        colNo:          1,
        mapNo:          1,
        qNo:            '094',
        qWord:          '雨[が](降ってきた)'
    },
    {
        colNo:          1,
        mapNo: 2,
        qNo:            '100',
        qWord:          '先生[が](来られた)'
    },
    {
        colNo:          1,
        mapNo: 3,
        qNo:            '101',
        qWord: 'どろぼう[が](入った)'
    },
    {
        colNo:          1,
        mapNo: 4,
        qNo:            '116',
        qWord: '酒[が](飲みたい)'
    },
    {
        colNo:          1,
        mapNo: 5,
        qNo:            '117',
        qWord: '酒[が](好きだ)'
    },
    {
        colNo:          1,
        mapNo: 6,
        qNo:            '118',
        qWord: '酒[を](飲む)'
    },
    {
        colNo:          1,
        mapNo: 7,
        qNo:            '115',
        qWord: 'おれ[を](連れて行ってくれ)'
    },
    {
        colNo:          1,
        mapNo: 8,
        qNo:            '145',
        qWord: '[そんな]ことを(言うな)'
    },
    {
        colNo:          1,
        mapNo: 9,
        qNo:            '145',
        qWord: 'そんな[ことを](言うな)'
    },
    {
        colNo:          1,
        mapNo: 10,
        qNo:            '120',
        qWord: 'あれ[は](学校だ)'
    },
    {
        colNo:          1,
        mapNo: 11,
        qNo:            '119',
        qWord: 'ビール[は](飲まない)'
    },
    {
        colNo:          1,
        mapNo: 12,
        qNo:            '119',
        qWord: '酒[は](飲む)'
    },
    {
        colNo:          1,
        mapNo: 13,
        qNo:            '103',
        qWord: 'おれ[の](手拭)'
    },
    {
        colNo:          1,
        mapNo: 14,
        qNo:            '104',
        qWord: '先生[の](手拭)'
    },
    {
        colNo:          1,
        mapNo: 15,
        qNo:            '105',
        qWord: 'どろぼう[の](手拭)'
    },
    {
        colNo:          1,
        mapNo: 16,
        qNo:            '102',
        qWord: '(ここに)有る[のは]'
    },
    {
        colNo:          1,
        mapNo: 17,
        qNo:            '143',
        qWord: '行く[のでは](ないか)'
    },
    {
        colNo:          1,
        mapNo: 18,
        qNo:            '098',
        qWord: '行く[のに](便利だ)'
    },
    {
        colNo:          1,
        mapNo: 19,
        qNo:            '106',
        qWord: '東の方[へ](行け)'
    },
    {
        colNo:          1,
        mapNo: 20,
        qNo: '107',
        qWord: '東京[に](着いた)'
    },
    {
        colNo:          1,
        mapNo: 21,
        qNo:            '108',
        qWord: '見[に](行った)'
    },
    {
        colNo:          1,
        mapNo: 22,
        qNo:            '110',
        qWord: '仕事[に](行った)'
    },
    {
        colNo:          1,
        mapNo: 23,
        qNo:            '112',
        qWord: '大工[に](なった)'
    },
    {
        colNo:          1,
        mapNo: 24,
        qNo:            '113',
        qWord: 'ここ[に](有る)'
    },
    {
        colNo:          1,
        mapNo: 25,
        qNo:            '114',
        qWord: 'おれ[に](貸せ)'
    },
    {
        colNo:          1,
        mapNo: 26,
        qNo:            '122',
        qWord: '息子[に](手伝いに来てもらった)'
    },
    {
        colNo:          1,
        mapNo: 27,
        qNo:            '124',
        qWord: '犬[に](追いかけられた)'
    },
    {
        colNo:          1,
        mapNo: 28,
        qNo:            '121',
        qWord: '運動場[で](遊ぶ)'
    },
    {
        colNo:          1,
        mapNo: 29,
        qNo:            '123',
        qWord: '船[で](来た)'
    },
    {
        colNo:          1,
        mapNo: 30,
        qNo:            '135',
        qWord: '１万円[で](お願いします)'
    },
    {
        colNo:          1,
        mapNo: 31,
        qNo:            '140',
        qWord: 'それ[より](あの方が良い)'
    },
    {
        colNo:          1,
        mapNo: 32,
        qNo:            '099',
        qWord: '田中[という]人'
    },
    {
        colNo:          1,
        mapNo: 33,
        qNo:            '095',
        qWord:  '(雨が)降っている[から]'
    },
    {
        colNo:          1,
        mapNo: 34,
        qNo:            '096',
        qWord: '[だ]から(言ったじゃないか)'
    },
    {
        colNo:          1,
        mapNo: 35,
        qNo:            '096',
        qWord:  'だ[から](言ったじゃないか)' 
    },
    {
        colNo:          1,
        mapNo: 36,
        qNo:            '141',
        qWord: '子ども[な]ので(わからなかった)'
    },
    {
        colNo:          1,
        mapNo: 37,
        qNo:            '141',
        qWord: '子どもな[ので](わからなかった)'
    },
    {
        colNo:          1,
        mapNo: 38,
        qNo:            '092',
        qWord: '寒い[けれども](がまんしよう)'
    },
    {
        colNo:          1,
        mapNo: 39,
        qNo:            '091',
        qWord: 'だ[けど](行かなければならない)'
    },
    {
        colNo:          1,
        mapNo: 40,
        qNo:            '097',
        qWord: '植えた[のに](枯れてしまった)'
    },
    {
        colNo:          1,
        mapNo: 41,
        qNo:            '129',
        qWord: '食い[ながら](歩くな)'
    },
    {
        colNo:          1,
        mapNo: 42,
        qNo:            '109',
        qWord: '買物[がてら](見物する)'
    },
    {
        colNo:          1,
        mapNo: 43,
        qNo:            '111',
        qWord: '帰り[がけに](買物をした)'
    },
    {
        colNo:          1,
        mapNo: 44,
        qNo:            '133',
        qWord: 'お茶[でも](飲もう)'
    },
    {
        colNo:          1,
        mapNo: 45,
        qNo:            '128',
        qWord: 'パン[でも]御飯[でも](好きな方を食べなさい)'
    },
    {
        colNo:          1,
        mapNo:          46,
        qNo:            '142',
        qWord:          '子ども[でも](知っている)'
    },
    {
        colNo:          1,
        mapNo:          47,
        qNo:            '131',
        qWord:          '皮[だけ](食べた)'
    },
    {
        colNo:          1,
        mapNo:          48,
        qNo:            '130',
        qWord:          '(食って)寝る[だけ]なら'
    },
    {
        colNo:          1,
        mapNo:          49,
        qNo:            '093',
        qWord:          '雨[ばかり](降っている)'
    },
    {
        colNo:          1,
        mapNo:          50,
        qNo:            '136',
        qWord:          '百円[くらい](使った)'
    },
    {
        colNo:          1,
mapNo: 51,
        qNo:            '137',
qWord: '百円[しか](ない)'
    },
    {
        colNo:          1,
mapNo: 52,
        qNo:            '134',
        qWord: '百円[ぶん](ください)'
    },
    {
        colNo:          1,
        mapNo:          53,
        qNo:            '132',
        qWord:          '皮[ごと](食べた)'
    },
    {
        colNo:          1,
        mapNo:          54,
        qNo:            '139',
        qWord:          '傘[なんか](いらない)'
    },
    {
        colNo:          1,
        mapNo:          55,
        qNo:            '138',
        qWord:          '安ければ安い[ほど](良い)'
    },
    {
        colNo:          1,
        mapNo:          56,
        qNo:            '125',
        qWord:          '何が起こる[やら](わからない)'
    },
    {
        colNo:          1,
        mapNo:          57,
        qNo:            '126',
        qWord:          '誰[やら](来た)'
    },
    {
        colNo:          1,
        mapNo:          58,
        qNo:            '127',
        qWord:          '筆[やら]紙[やら](たくさんもらった)'
    },
    {
        colNo:          1,
        mapNo:          59,
        qNo:            '144',
        qWord:          '行く[だの]行かない[だの](ぐずぐず言うな)'
    },
    {
        colNo:          1,
        mapNo:          60,
        qNo:            '146',
        qWord:          '今日[こそ](終わらせる)'
    },
    {
        colNo: 2,
        mapNo:          61,
        qNo:            '016',
        qWord:          '起きる　動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          62,
        qNo:            '021',
        qWord:          '飽きる　動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          63,
        qNo:            '026',
        qWord:          '足りる　動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          64,
        qNo:            '018',
        qWord:          '開ける　動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          65,
        qNo:            '022',
        qWord:          '任せる　動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          66,
        qNo:            '017',
        qWord:          '寝る　動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          67,
        qNo:            '023',
        qWord:          '書く　動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          68,
        qNo:            '027',
        qWord:          '死ぬ　動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          69,
        qNo:            '019',
        qWord:          '来る　動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          70,
        qNo:            '020',
        qWord:          'する　動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          71,
        qNo:            '029',
        qWord:          '書く(人)　動詞・連体形'
    },
    {
        colNo: 2,
        mapNo:          72,
        qNo:            '001',
        qWord:          '起きない　動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          73,
        qNo:            '012',
        qWord:          '飽きない　動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          74,
        qNo:            '011',
        qWord:          '見ない　動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          75,
        qNo:            '010',
        qWord:          '借りない　動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          76,
        qNo:            '008',
        qWord:          '足りない　動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          77,
        qNo:            '006',
        qWord:          '開けない　動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          78,
        qNo:            '005',
        qWord:          '任せない　動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          79,
        qNo:            '002',
        qWord:          '寝ない　動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          80,
        qNo:            '007',
        qWord:          '書かない　動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          81,
        qNo:            '009',
        qWord:          '貸さない　動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          82,
        qNo:            '013',
        qWord:          '蹴らない　動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          83,
        qNo:            '003',
        qWord:          '来ない　動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          84,
        qNo:            '004',
        qWord:          'しない　動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          85,
        qNo:            '032',
        qWord:          '起きろ　動詞・命令形'
    },
    {
        colNo: 2,
        mapNo:          86,
        qNo:            '035',
        qWord:          '見ろ　動詞・命令形'
    },
    {
        colNo: 2,
        mapNo:          87,
        qNo:            '034',
        qWord:          '開けろ　動詞・命令形'
    },
    {
        colNo: 2,
        mapNo:          88,
        qNo:            '038',
        qWord:          '任せろ　動詞・命令形'
    },
    {
        colNo: 2,
        mapNo:          89,
        qNo:            '037',
        qWord:          '蹴れ　動詞・命令形'
    },
    {
        colNo: 2,
        mapNo:          90,
        qNo:            '036',
        qWord:          '来い　動詞・命令形'
    },
    {
        colNo: 2,
        mapNo:          91,
        qNo:            '033',
        qWord:          'しろ　動詞・命令形'
    },
    {
        colNo: 2,
        mapNo:          92,
        qNo:            '040',
        qWord:          '出した　動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          93,
        qNo:            '048',
        qWord:          '飽きた　動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          94,
        qNo:            '049',
        qWord:          '任せた　動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          95,
        qNo:            '046',
        qWord:          '行った　動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          96,
        qNo:            '041',
        qWord:          '書いた　動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          97,
        qNo:            '045',
        qWord:          '研いだ　動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          98,
        qNo:            '050',
        qWord:          '貸した　動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          99,
        qNo:            '052',
        qWord:          '建てた　動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          100,
        qNo:            '053',
        qWord:          '建った　動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          101,
        qNo:            '054',
        qWord:          '立った　動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          102,
        qNo:            '044',
        qWord:          '飛んだ　動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          103,
        qNo:            '043',
        qWord:          '飲んだ　動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          104,
        qNo:            '047',
        qWord:          '蹴った　動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          105,
        qNo:            '051',
        qWord:          '買った　動詞・過去形'
    },
    {
        colNo: 3,
        mapNo:          106,
        qNo:            '060',
        qWord:          '起きよう　動詞・意志形'
    },
    {
        colNo: 3,
        mapNo:          107,
        qNo:            '063',
        qWord:          '開けよう　動詞・意志形'
    },
    {
        colNo: 3,
        mapNo:          108,
        qNo:            '061',
        qWord:          '寝よう　動詞・意志形'
    },
    {
        colNo: 3,
        mapNo:          109,
        qNo:            '065',
        qWord:          '書こう　動詞・意志形'
    },
    {
        colNo: 3,
        mapNo:          110,
        qNo:            '064',
        qWord:          '来よう　動詞・意志形'
    },
    {
        colNo: 3,
        mapNo:          111,
        qNo:            '062',
        qWord:          'しよう　動詞・意志形'
    },
    {
        colNo: 3,
        mapNo:          112,
        qNo:            '067',
        qWord:          '書くだろう　動詞・推量形'
    },
    {
        colNo: 3,
        mapNo:          113,
        qNo:            '068',
        qWord:          '来るだろう　動詞・推量形'
    },
    {
        colNo: 3,
        mapNo:          114,
        qNo:            '069',
        qWord:          'するだろう　動詞・推量形'
    },
    {
        colNo: 3,
        mapNo:          115,
        qNo:            '025',
        qWord:          '書かれる　動詞・受身形'
    },
    {
        colNo: 3,
        mapNo:          116,
        qNo:            '072',
        qWord:          '来られると　動詞・受身形'
    },
    {
        colNo: 3,
        mapNo:          117,
        qNo:            '073',
        qWord:          'される　動詞・受身形'
    },
    {
        colNo: 3,
        mapNo:          118,
        qNo:            '077',
        qWord:          '開けさせる　動詞・使役'
    },
    {
        colNo: 3,
        mapNo:          119,
        qNo:            '024',
        qWord:          '書かせる　動詞・使役'
    },
    {
        colNo: 3,
        mapNo:          120,
        qNo:            '076',
        qWord:          '来させる　動詞・使役'
    },
    {
        colNo: 3,
        mapNo:          121,
        qNo:            '075',
        qWord:          'させる　動詞・使役'
    },
    {
        colNo: 3,
        mapNo:          122,
        qNo:            '039',
        qWord:          '書かせろ　動詞・使役'
    },
    {
        colNo: 3,
        mapNo:          123,
        qNo:            '042',
        qWord:          '書かせた　動詞・使役'
    },
    {
        colNo: 3,
        mapNo:          124,
        qNo:            '066',
        qWord:          '書かせよう　動詞・使役'
    },
    {
        colNo: 3,
        mapNo:          125,
        qNo:            '074',
        qWord:          '書かせられる　動詞・使役'
    },
    {
        colNo: 3,
        mapNo:          126,
        qNo:            '078',
        qWord:          '起きれば　動詞・仮定形１'
    },
    {
        colNo: 3,
        mapNo:          127,
        qNo:            '082',
        qWord:          '任せれば　動詞・仮定形１'
    },
    {
        colNo: 3,
        mapNo:          128,
        qNo:            '081',
        qWord:          '書けば　動詞・仮定形１'
    },
    {
        colNo: 3,
        mapNo:          129,
        qNo:            '083',
        qWord:          '死ねば　動詞・仮定形１'
    },
    {
        colNo: 3,
        mapNo:          130,
        qNo:            '079',
        qWord:          '来れば　動詞・仮定形１'
    },
    {
        colNo: 3,
        mapNo:          131,
        qNo:            '080',
        qWord:          'すれば　動詞・仮定形１'
    },
    {
        colNo: 3,
        mapNo:          132,
        qNo:            '085',
        qWord:          '起きるなら　動詞・仮定形２'
    },
    {
        colNo: 3,
        mapNo:          133,
        qNo:            '088',
        qWord:          '書くなら　動詞・仮定形２'
    },
    {
        colNo: 3,
        mapNo:          134,
        qNo:            '086',
        qWord:          '来るなら　動詞・仮定形２'
    },
    {
        colNo: 3,
        mapNo:          135,
        qNo:            '087',
        qWord:          'するなら　動詞・仮定形２'
    },
    {
        colNo: 3,
        mapNo:          136,
        qNo:            '030',
        qWord:          '高い(物)　形容詞'
    },
    {
        colNo: 3,
        mapNo:          137,
        qNo:            '014',
        qWord:          '高くない　形容詞'
    },
    {
        colNo: 3,
        mapNo:          138,
        qNo:            '057',
        qWord:          '高くて　形容詞'
    },
    {
        colNo: 3,
        mapNo:          139,
        qNo:            '058',
        qWord:          '高くなる　形容詞'
    },
    {
        colNo: 3,
        mapNo:          140,
        qNo:            '059',
        qWord:          '珍しくなる　形容詞'
    },
    {
        colNo: 3,
        mapNo:          141,
        qNo:            '055',
        qWord:          '高かった　形容詞'
    },
    {
        colNo: 3,
        mapNo:          142,
        qNo:            '070',
        qWord:          '高いだろう　形容詞'
    },
    {
        colNo: 3,
        mapNo:          143,
        qNo:            '084',
        qWord:          '高ければ　形容詞'
    },
    {
        colNo: 3,
        mapNo:          144,
        qNo:            '089',
        qWord:          '高いなら　形容詞'
    },
    {
        colNo: 3,
        mapNo:          145,
        qNo:            '028',
        qWord:          '静かだ　形容動詞'
    },
    {
        colNo: 3,
        mapNo:          146,
        qNo:            '031',
        qWord:          '静かな(ところ)　形容動詞'
    },
    {
        colNo: 3,
        mapNo:          147,
        qNo:            '015',
        qWord:          '静かでない　形容動詞'
    },
    {
        colNo: 3,
        mapNo:          148,
        qNo:            '056',
        qWord:          '静かだった　形容動詞'
    },
    {
        colNo: 3,
        mapNo:          149,
        qNo:            '071',
        qWord:          '静かだろう　形容動詞'
    },
    {
        colNo: 3,
        mapNo:          150,
        qNo:            '090',
        qWord:          '静かなら　形容動詞'
    },
    {
        colNo: 4,
        mapNo:          151,
        qNo:            '198',
        qWord:          '行かなかった'
    },
    {
        colNo: 4,
        mapNo:          152,
        qNo:            '199',
        qWord:          '行きはしなかった'
    },
    {
        colNo: 4,
        mapNo:          153,
        qNo:            '185',
        qWord:          '行かなければ'
    },
    {
        colNo: 4,
        mapNo:          154,
        qNo:            '183',
        qWord:          '行かないなら'
    },
    {
        colNo: 4,
        mapNo:          155,
        qNo:            '196',
        qWord:          '行かないで'
    },
    {
        colNo: 4,
        mapNo:          156,
        qNo:            '197',
        qWord:          '行かなくて'
    },
    {
        colNo: 4,
        mapNo:          157,
        qNo:            '180',
        qWord:          '行かなくても'
    },
    {
        colNo: 4,
        mapNo:          158,
        qNo:            '203',
        qWord:          '無かった'
    },
    {
        colNo: 4,
        mapNo:          159,
        qNo:            '202',
        qWord:          '[高くは]なかった'
    },
    {
        colNo: 4,
        mapNo:          160,
        qNo:            '202',
        qWord:          '高くは[なかった]'
    },
    {
        colNo: 4,
        mapNo:          161,
        qNo:            '200',
        qWord:          '見はしない'
    },
    {
        colNo: 4,
        mapNo:          162,
        qNo:            '201',
        qWord:          '来はしない'
    },
    {
        colNo: 4,
        mapNo:          163,
        qNo:            '204',
        qWord:          '[うん]，無いよ'
    },
    {
        colNo: 4,
        mapNo:          164,
        qNo:            '204',
        qWord:          'うん，[無いよ]'
    },
    {
        colNo: 4,
        mapNo:          165,
        qNo:            '205',
        qWord:          '[いや]，有るよ'
    },
    {
        colNo: 4,
        mapNo:          166,
        qNo:            '205',
        qWord:          'いや，[有るよ]'
    },
    {
        colNo: 4,
        mapNo:          167,
        qNo:            '178',
        qWord:          '降れば(船は出ないだろう)'
    },
    {
        colNo: 4,
        mapNo:          168,
        qNo:            '179',
        qWord:          '降ったら(おれは行かない)'
    },
    {
        colNo: 4,
        mapNo:          169,
        qNo:            '182',
        qWord:          '行くと(だめになりそうだ)'
    },
    {
        colNo: 4,
        mapNo:          170,
        qNo:            '184',
        qWord:          '行ったら(終っていた)'
    },
    {
        colNo: 4,
        mapNo:          171,
        qNo:            '181',
        qWord:          '[行ったって]だめだ'
    },
    {
        colNo: 4,
        mapNo:          172,
        qNo:            '181',
        qWord:          '行ったって[だめだ]'
    },
    {
        colNo: 4,
        mapNo:          173,
        qNo:            '211',
        qWord:          '読むことができる[能力可能]'
    },
    {
        colNo: 4,
        mapNo:          174,
        qNo:            '213',
        qWord:          '読むことができる[状況可能]'
    },
    {
        colNo: 4,
        mapNo:          175,
        qNo:            '215',
        qWord:          '着ることができる[能力可能]'
    },
    {
        colNo: 4,
        mapNo:          176,
        qNo:            '217',
        qWord:          '着ることができる[状況可能]'
    },
    {
        colNo: 4,
        mapNo:          177,
        qNo:            '218',
        qWord:          '起きることができる[状況可能]'
    },
    {
        colNo: 4,
        mapNo:          178,
        qNo:            '219',
        qWord:          '来ることができる[状況可能]'
    },
    {
        colNo: 4,
        mapNo:          179,
        qNo:            '221',
        qWord:          'することができる[能力可能]'
    },
    {
        colNo: 4,
        mapNo:          180,
        qNo:            '222',
        qWord:          'できる[能力可能]'
    },
    {
        colNo: 4,
        mapNo:          181,
        qNo:            '220',
        qWord:          '書くことができる[属性可能]'
    },
    {
        colNo: 4,
        mapNo:          182,
        qNo:            '210',
        qWord:          '読むことができない[能力可能]'
    },
    {
        colNo: 4,
        mapNo:          183,
        qNo:            '212',
        qWord:          '読むことができない[状況可能]'
    },
    {
        colNo: 4,
        mapNo:          184,
        qNo:            '214',
        qWord:          '着ることができない[能力可能]'
    },
    {
        colNo: 4,
        mapNo:          185,
        qNo:            '216',
        qWord:          '着ることができない[状況可能]'
    },
    {
        colNo: 4,
        mapNo:          186,
        qNo:            '2213',
        qWord:          '[おもしろかった]なあ'
    },
    {
        colNo: 4,
        mapNo:          187,
        qNo:            '223',
        qWord:          'おもしろかった[なあ]'
    },
    {
        colNo: 4,
        mapNo:          188,
        qNo:            '224',
        qWord:          '[行った]なあ'
    },
    {
        colNo: 4,
        mapNo:          189,
        qNo:            '224',
        qWord:          '行った[なあ]'
    },
    {
        colNo: 4,
        mapNo:          190,
        qNo:            '225',
        qWord:          '[いた]よ'
    },
    {
        colNo: 4,
        mapNo:          191,
        qNo:            '225',
        qWord:          'いた[よ]'
    },
    {
        colNo: 4,
        mapNo:          192,
        qNo:            '227',
        qWord:          '[書いた]よ'
    },
    {
        colNo: 4,
        mapNo:          193,
        qNo:            '227',
        qWord:          '書いた[よ]'
    },
    {
        colNo: 4,
        mapNo:          194,
        qNo:            '226',
        qWord:          '[強かった]よ'
    },
    {
        colNo: 4,
        mapNo:          195,
        qNo:            '226',
        qWord:          '強かった[よ]'
    },
    {
        colNo: 4,
        mapNo:          196,
        qNo:            '229',
        qWord:          'いた'
    },
    {
        colNo: 4,
        mapNo:          197,
        qNo:            '230',
        qWord:          'いるか'
    },
    {
        colNo: 4,
        mapNo:          198,
        qNo:            '231',
        qWord:          '散っている[進行態]'
    },
    {
        colNo: 4,
        mapNo:          199,
        qNo:            '232',
        qWord:          '散っている[結果態]'
    },
    {
        colNo: 4,
        mapNo:          200,
        qNo:            '233',
        qWord:          '散リヨル[将然態]'
    },
    {
        colNo: 4,
        mapNo:          201,
        qNo:            '234',
        qWord:          '死ニヨル[将然態]'
    },
    {
        colNo: 4,
        mapNo:          202,
        qNo:            '236',
        qWord:          '有リヨル[進行態]'
    },
    {
        colNo: 4,
        mapNo:          203,
        qNo:            '235',
        qWord:          '[もう少しで]落ちるところだった'
    },
    {
        colNo: 4,
        mapNo:          204,
        qNo:            '235',
        qWord:          'もう少しで[落ちるところだった]'
    },
    {
        colNo: 4,
        mapNo:          205,
        qNo:            '228',
        qWord:          '読んでしまった'
    },
    {
        colNo: 5,
        mapNo:          206,
        qNo:            '154',
        qWord:          '[行かなければ]ならない'
    },
    {
        colNo: 5,
        mapNo:          207,
        qNo:            '154',
        qWord:          '行かなければ[ならない]'
    },
    {
        colNo: 5,
        mapNo:          208,
        qNo:            '154',
        qWord:          '行かなければならない―総合図―'
    },
    {
        colNo: 5,
        mapNo:          209,
        qNo:            '147',
        qWord:          '起きろ(やさしく)―その１―'
    },
    {
        colNo: 5,
        mapNo:          210,
        qNo:            '147',
        qWord:          '起きろ(やさしく)―その２―'
    },
    {
        colNo: 5,
        mapNo:          211,
        qNo:            '147',
        qWord:          '起きろ(やさしく)―総合図―'
    },
    {
        colNo: 5,
        mapNo:          212,
        qNo:            '148',
        qWord:          '起きろ(きびしく)―その１―'
    },
    {
        colNo: 5,
        mapNo:          213,
        qNo:            '148',
        qWord:          '起きろ(きびしく)―その２―'
    },
    {
        colNo: 5,
        mapNo:          214,
        qNo:            '148',
        qWord:          '起きろ(きびしく)―総合図―'
    },
    {
        colNo: 5,
        mapNo:          215,
        qNo:            '149',
        qWord:          '開けろ(やさしく)―その１―'
    },
    {
        colNo: 5,
        mapNo:          216,
        qNo:            '149',
        qWord:          '開けろ(やさしく)―その２―'
    },
    {
        colNo: 5,
        mapNo:          217,
        qNo:            '149',
        qWord:          '開けろ(やさしく)―その３―'
    },
    {
        colNo: 5,
        mapNo:          218,
        qNo:            '150',
        qWord:          '開けろ(きびしく)―その１―'
    },
    {
        colNo: 5,
        mapNo:          219,
        qNo:            '150',
        qWord:          '開けろ(きびしく)―その２―'
    },
    {
        colNo: 5,
        mapNo:          220,
        qNo:            '150',
        qWord:          '開けろ(きびしく)―その３―'
    },
    {
        colNo: 5,
        mapNo:          221,
        qNo:            '151',
        qWord:          '[行くな]よ(やさしく)'
    },
    {
        colNo: 5,
        mapNo:          222,
        qNo:            '151',
        qWord:          '行くな[よ](やさしく)'
    },
    {
        colNo: 5,
        mapNo:          223,
        qNo:            '152',
        qWord:          '[行くな]よ(きびしく)'
    },
    {
        colNo: 5,
        mapNo:          224,
        qNo:            '152',
        qWord:          '行くな[よ](きびしく)'
    },
    {
        colNo: 5,
        mapNo:          225,
        qNo:            '153',
        qWord:          '[行っては]いけない'
    },
    {
        colNo: 5,
        mapNo:          226,
        qNo:            '153',
        qWord:          '行っては[いけない]'
    },
    {
        colNo: 5,
        mapNo:          227,
        qNo:            '161',
        qWord:          '[行きたい]なあ'
    },
    {
        colNo: 5,
        mapNo:          228,
        qNo:            '161',
        qWord:          '行きたい[なあ]'
    },
    {
        colNo: 5,
        mapNo:          229,
        qNo:            '163',
        qWord:          '行きたくない―その１―'
    },
    {
        colNo: 5,
        mapNo:          230,
        qNo:            '163',
        qWord:          '行きたくない―その２―'
    },
    {
        colNo: 5,
        mapNo:          231,
        qNo:            '164',
        qWord:          '行ってもらいたい'
    },
    {
        colNo: 5,
        mapNo:          232,
        qNo:            '158',
        qWord:          '[行こう]と思っている'
    },
    {
        colNo: 5,
        mapNo:          233,
        qNo:            '158',
        qWord:          '行こう[と思っている]'
    },
    {
        colNo: 5,
        mapNo:          234,
        qNo:            '159',
        qWord:          '行くまい'
    },
    {
        colNo: 5,
        mapNo:          235,
        qNo:            '160',
        qWord:          '[行こう]よ'
    },
    {
        colNo: 5,
        mapNo:          236,
        qNo:            '160',
        qWord:          '行こう[よ]'
    },
    {
        colNo: 5,
        mapNo:          237,
        qNo:            '165',
        qWord:          '行くだろう'
    },
    {
        colNo: 5,
        mapNo:          238,
        qNo:            '167',
        qWord:          '行くのだろう'
    },
    {
        colNo: 5,
        mapNo:          239,
        qNo:            '168',
        qWord:          '行っただろう'
    },
    {
        colNo: 5,
        mapNo:          240,
        qNo:            '170',
        qWord:          '雨だろう'
    },
    {
        colNo: 5,
        mapNo:          241,
        qNo:            '171',
        qWord:          '降りそうだ'
    },
    {
        colNo: 5,
        mapNo:          242,
        qNo:            '172',
        qWord:          '良さそうだ'
    },
    {
        colNo: 5,
        mapNo:          243,
        qNo:            '174',
        qWord:          '雨だそうだ―その１―'
    },
    {
        colNo: 5,
        mapNo:          244,
        qNo:            '174',
        qWord:          '雨だそうだ―その２―'
    },
    {
        colNo: 5,
        mapNo:          245,
        qNo:            '174',
        qWord:          '雨だそうだ―その３―'
    },
    {
        colNo: 5,
        mapNo:          246,
        qNo:            '174',
        qWord:          '雨だそうだ―総合図―'
    },
    {
        colNo: 5,
        mapNo:          247,
        qNo:            '175',
        qWord:          '高いそうだ―その１―'
    },
    {
        colNo: 5,
        mapNo:          248,
        qNo:            '175',
        qWord:          '高いそうだ―その２―'
    },
    {
        colNo: 5,
        mapNo:          249,
        qNo:            '175',
        qWord:          '高いそうだ―その３―'
    },
    {
        colNo: 5,
        mapNo:          250,
        qNo:            '176',
        qWord:          'いたそうだ―その１―'
    },
    {
        colNo: 5,
        mapNo:          251,
        qNo:            '176',
        qWord:          'いたそうだ―その２―'
    },
    {
        colNo: 5,
        mapNo:          252,
        qNo:            '176',
        qWord:          'いたそうだ―その３―'
    },
    {
        colNo: 5,
        mapNo:          253,
        qNo:            '189',
        qWord:          '誰かが(知っているだろう)'
    },
    {
        colNo: 5,
        mapNo:          254,
        qNo:            '190',
        qWord:          'どこかに(あるだろう)'
    },
    {
        colNo: 5,
        mapNo:          255,
        qNo:            '191',
        qWord:          'いつか(聞いたことがある)'
    },
    {
        colNo: 5,
        mapNo:          256,
        qNo:            '188',
        qWord:          '(それは)何か'
    },
    {
        colNo: 5,
        mapNo:          257,
        qNo:            '187',
        qWord:          '[誰が]行くか(分らない)'
    },
    {
        colNo: 5,
        mapNo:          258,
        qNo:            '187',
        qWord:          '誰が[行くか](分らない)'
    },
    {
        colNo: 5,
        mapNo:          259,
        qNo:            '193',
        qWord:          '[誰が]やるものか'
    },
    {
        colNo: 5,
        mapNo:          260,
        qNo:            '193',
        qWord:          '誰が[やるものか]―その１―'
    },
    {
        colNo: 5,
        mapNo:          261,
        qNo:            '193',
        qWord:          '誰が[やるものか]―その２―'
    },
    {
        colNo: 5,
        mapNo:          262,
        qNo:            '206',
        qWord:          'もらった'
    },
    {
        colNo: 5,
        mapNo:          263,
        qNo:            '208',
        qWord:          'やった'
    },
    {
        colNo: 5,
        mapNo:          264,
        qNo:            '209',
        qWord:          '[やった]か'
    },
    {
        colNo: 5,
        mapNo:          265,
        qNo:            '209',
        qWord:          'やった[か]'
    },
    {
        colNo: 5,
        mapNo:          266,
        qNo:            '207',
        qWord:          'くれ'
    },
    {
        colNo: 5,
        mapNo:          267,
        qNo:            '241',
        qWord:          'ありがとう―短い形―'
    },
    {
        colNo: 5,
        mapNo:          268,
        qNo:            '241',
        qWord:          'ありがとう―長い形の前半―'
    },
    {
        colNo: 5,
        mapNo:          269,
        qNo:            '241',
        qWord:          'ありがとう―長い形の後半―'
    },
    {
        colNo: 5,
        mapNo:          270,
        qNo:            '270',
        qWord:          'ありがとう―総合図―'
    },
    {
        colNo: 6,
        mapNo:          271,
        qNo:            '252-B',
        qWord:          '[書きます]か(B場面)'
    },
    {
        colNo: 6,
        mapNo:          272,
        qNo:            '252-B',
        qWord:          '書きます[か](B場面)'
    },
    {
        colNo: 6,
        mapNo:          273,
        qNo:            '252-A',
        qWord:          '[書きます]か(A場面)'
    },
    {
        colNo: 6,
        mapNo:          274,
        qNo:            '252-A',
        qWord:          '書きます[か](A場面)'
    },
    {
        colNo: 6,
        mapNo:          275,
        qNo:            '246-B',
        qWord:          'どこへ[行きますか](B場面)―一般動詞―'
    },
    {
        colNo: 6,
        mapNo:          276,
        qNo:            '246-B',
        qWord:          'どこへ[行きますか](B場面)―敬語動詞―'
    },
    {
        colNo: 6,
        mapNo:          277,
        qNo:            '246-B',
        qWord:          '[どこへ]行きますか(B場面)'
    },
    {
        colNo: 6,
        mapNo:          278,
        qNo:            '250-B',
        qWord:          'ここに[来ますか](B場面)―一般動詞―'
    },
    {
        colNo: 6,
        mapNo:          279,
        qNo:            '250-B',
        qWord:          'ここに[来ますか](B場面)―敬語動詞―'
    },
    {
        colNo: 6,
        mapNo:          280,
        qNo:            '250-B',
        qWord:          '[ここに]来ますか(B場面)'
    },
    {
        colNo: 6,
        mapNo:          281,
        qNo:            '249-B',
        qWord:          'いますか(B場面)―一般動詞―'
    },
    {
        colNo: 6,
        mapNo:          282,
        qNo:            '249-B',
        qWord:          'いますか(B場面)―敬語動詞―'
    },
    {
        colNo: 6,
        mapNo:          283,
        qNo:            '249-A',
        qWord:          'いますか(A場面)―一般動詞―'
    },
    {
        colNo: 6,
        mapNo:          284,
        qNo:            '249-A',
        qWord:          'いますか(A場面)―敬語動詞―'
    },
    {
        colNo: 6,
        mapNo:          285,
        qNo:            '265',
        qWord:          '(自分の父に)いますか―一般動詞―'
    },
    {
        colNo: 6,
        mapNo:          286,
        qNo:            '265',
        qWord:          '(自分の父に)いますか―敬語動詞―'
    },
    {
        colNo: 6,
        mapNo:          287,
        qNo:            '251-B',
        qWord:          '知っ[ていますか](B場面)―一般動詞―'
    },
    {
        colNo: 6,
        mapNo:          288,
        qNo:            '251-B',
        qWord:          '知っ[ていますか](B場面)―敬語動詞―'
    },
    {
        colNo: 6,
        mapNo:          289,
        qNo:            '251-B',
        qWord:          '[知っ]ていますか(B場面)―287，288に続く形―'
    },
    {
        colNo: 6,
        mapNo:          290,
        qNo:            '251-B',
        qWord:          '知っていますか(B場面)―287，288，289以外の回答―'
    },
    {
        colNo: 6,
        mapNo:          291,
        qNo:            '253-B',
        qWord:          '食べますか(B場面)―一般動詞―'
    },
    {
        colNo: 6,
        mapNo:          292,
        qNo:            '253-B',
        qWord:          '食べますか(B場面)―敬語動詞―'
    },
    {
        colNo: 6,
        mapNo:          293,
        qNo:            '254-B',
        qWord:          '言いましたか(B場面)―一般動詞―'
    },
    {
        colNo: 6,
        mapNo:          294,
        qNo:            '254-B',
        qWord:          '言いましたか(B場面)―敬語動詞―'
    },
    {
        colNo: 6,
        mapNo:          295,
        qNo:            '267',
        qWord:          '(あの先生は)行くのか―一般動詞―'
    },
    {
        colNo: 6,
        mapNo:          296,
        qNo:            '267',
        qWord:          '(あの先生は)行くのか―敬語動詞―'
    },
    {
        colNo: 6,
        mapNo:          297,
        qNo:            '257-B',
        qWord:          '行きなさい(B場面)―一般動詞―'
    },
    {
        colNo: 6,
        mapNo:          298,
        qNo:            '257-B',
        qWord:          '行きなさい(B場面)―敬語動詞―'
    },
    {
        colNo: 6,
        mapNo:          299,
        qNo:            '257-B',
        qWord:          '行きなさい(B場面)―297，298に続く形―'
    },
    {
        colNo: 6,
        mapNo:          300,
        qNo:            '255-B',
        qWord:          '来なさい(B場面)―一般動詞―'
    },
    {
        colNo: 6,
        mapNo:          301,
        qNo:            '255-B',
        qWord:          '来なさい(B場面)―敬語動詞―'
    },
    {
        colNo: 6,
        mapNo:          302,
        qNo:            '255-B',
        qWord:          '来なさい(B場面)―300，301に続く形―'
    },
    {
        colNo: 6,
        mapNo:          303,
        qNo:            '256-B',
        qWord:          'いなさい(B場面)―一般動詞―'
    },
    {
        colNo: 6,
        mapNo:          304,
        qNo:            '256-B',
        qWord:          'いなさい(B場面)―敬語動詞―'
    },
    {
        colNo: 6,
        mapNo:          305,
        qNo:            '256-B',
        qWord:          'いなさい(B場面)―303，304に続く形―'
    },
    {
        colNo: 6,
        mapNo:          306,
        qNo:            '247-B',
        qWord:          'はい，[行きます](B場面)'
    },
    {
        colNo: 6,
        mapNo:          307,
        qNo:            '247-B',
        qWord:          '[はい]，行きます(B場面)'
    },
    {
        colNo: 6,
        mapNo:          308,
        qNo:            '247-A',
        qWord:          'はい，[行きます](A場面)'
    },
    {
        colNo: 6,
        mapNo:          309,
        qNo:            '247-A',
        qWord:          '[はい]，行きます(A場面)'
    },
    {
        colNo: 6,
        mapNo:          310,
        qNo:            '247-O',
        qWord:          'はい，[行きます](O場面)'
    },
    {
        colNo: 6,
        mapNo:          311,
        qNo:            '247-O',
        qWord:          '[はい]，行きます(O場面)'
    },
    {
        colNo: 6,
        mapNo:          312,
        qNo:            '259-B',
        qWord:          '来ます(B場面)'
    },
    {
        colNo: 6,
        mapNo:          313,
        qNo:            '259-A',
        qWord:          '来ます(A場面)'
    },
    {
        colNo: 6,
        mapNo:          314,
        qNo:            '258-B',
        qWord:          'います(B場面)'
    },
    {
        colNo: 6,
        mapNo:          315,
        qNo:            '264-B',
        qWord:          '(自分の父が)[来ます]から(B場面)―一般動詞―'
    },
    {
        colNo: 6,
        mapNo:          316,
        qNo:            '264-B',
        qWord:          '(自分の父が)[来ます]から(B場面)―敬語動詞―'
    },
    {
        colNo: 6,
        mapNo:          317,
        qNo:            '264-A',
        qWord:          '(自分の父が)[来ます]から(A場面)―一般動詞―'
    },
    {
        colNo: 6,
        mapNo:          318,
        qNo:            '264-A',
        qWord:          '(自分の父が)[来ます]から(A場面)―敬語動詞―'
    },
    {
        colNo: 6,
        mapNo:          319,
        qNo:            '262-B',
        qWord:          'あげましょう(B場面)'
    },
    {
        colNo: 6,
        mapNo:          320,
        qNo:            '260-B',
        qWord:          '持ちましょう(B場面)'
    },
    {
        colNo: 6,
        mapNo:          321,
        qNo:            '244-B',
        qWord:          '[寒いです]ね(B場面)'
    },
    {
        colNo: 6,
        mapNo:          322,
        qNo:            '244-B',
        qWord:          '寒いです[ね](B場面)'
    },
    {
        colNo: 6,
        mapNo:          323,
        qNo:            '244-A',
        qWord:          '[寒いです]ね(A場面)'
    },
    {
        colNo: 6,
        mapNo:          324,
        qNo:            '244-A',
        qWord:          '寒いです[ね](A場面)'
    },
    {
        colNo: 6,
        mapNo:          325,
        qNo:            '244-O',
        qWord:          '[寒いです]ね(O場面)'
    },
    {
        colNo: 6,
        mapNo:          326,
        qNo:            '244-O',
        qWord:          '寒いです[ね](O場面)'
    },
    {
        colNo: 6,
        mapNo:          327,
        qNo:            '261-B',
        qWord:          '[本です]ね(B場面)'
    },
    {
        colNo: 6,
        mapNo:          328,
        qNo:            '261-B',
        qWord:          '本です[ね](B場面)'
    },
    {
        colNo: 6,
        mapNo:          329,
        qNo:            '261-A',
        qWord:          '[本です]ね(A場面)'
    },
    {
        colNo: 6,
        mapNo:          330,
        qNo:            '261-A',
        qWord:          '本です[ね](A場面)'
    },
    {
        colNo: 6,
        mapNo:          331,
        qNo:            '248-B',
        qWord:          'いいえ，役場[ではありません](B場面)'
    },
    {
        colNo: 6,
        mapNo:          332,
        qNo:            '248-B',
        qWord:          '[いいえ]，役場ではありません(B場面)'
    },
    {
        colNo: 6,
        mapNo:          333,
        qNo:            '242-B',
        qWord:          '[あなた]の傘(B場面)'
    },
    {
        colNo: 6,
        mapNo:          334,
        qNo:            '242-B',
        qWord:          'あなた[の傘](B場面)'
    },
    {
        colNo: 6,
        mapNo:          335,
        qNo:            '242-A',
        qWord:          '[あなた]の傘(A場面)'
    },
    {
        colNo: 6,
        mapNo:          336,
        qNo:            '242-O',
        qWord:          '[あなた]の傘(O場面)'
    },
    {
        colNo: 6,
        mapNo:          337,
        qNo:            '242-O',
        qWord:          'あなた[の傘](O場面)'
    },
    {
        colNo: 6,
        mapNo:          338,
        qNo:            '243-B',
        qWord:          '[私]のです(B場面)'
    },
    {
        colNo: 6,
        mapNo:          339,
        qNo:            '243-B',
        qWord:          '私[の]です(B場面)'
    },
    {
        colNo: 6,
        mapNo:          340,
        qNo:            '243-A',
        qWord:          '[私]のです(A場面)'
    },
    {
        colNo: 6,
        mapNo:          341,
        qNo:            '243-O',
        qWord:          '[私]のです(O場面)'
    },
    {
        colNo: 6,
        mapNo:          342,
        qNo:            '243-O',
        qWord:          '私[の]です(O場面)'
    },
    {
        colNo: 6,
        mapNo:          343,
        qNo:            '245(1)-B',
        qWord:          '役場に[なあ]，行ったらなあ(B場面)'
    },
    {
        colNo: 6,
        mapNo:          344,
        qNo:            '245(1)-A',
        qWord:          '役場に[なあ]，行ったらなあ(A場面)'
    },
    {
        colNo: 6,
        mapNo:          345,
        qNo:            '245(1)-O',
        qWord:          '役場に[なあ]，行ったらなあ(O場面)'
    },
    {
        colNo: 6,
        mapNo:          346,
        qNo:            '245(2)-B',
        qWord:          '役場になあ，行ったら[なあ](B場面)'
    },
    {
        colNo: 6,
        mapNo:          347,
        qNo:            '245(2)-A',
        qWord:          '役場になあ，行ったら[なあ](A場面)'
    },
    {
        colNo: 6,
        mapNo:          348,
        qNo:            '245(2)-O',
        qWord:          '役場になあ，行ったら[なあ](O場面)'
    },
    {
        colNo: 6,
        mapNo:          349,
        qNo:            '237',
        qWord:          'おはようございます'
    },
    {
        colNo: 6,
        mapNo:          350,
        qNo:            '240',
        qWord:          'こんばんは'
    }
];

gajdViewer.initialize = function (mapCanvasId,
                                  conditionContainerId,
                                  legendContainerId
                                 ) {
    this._mapCanvasId = mapCanvasId;
    this._conditionContainerId = conditionContainerId;
    this._legendContainerId = legendContainerId;
    
    var defaultCenter = new google.maps.LatLng(gajdViewer.getCenterLat("550000"), gajdViewer.getCenterLng("550000"));
    var defaultZoom = 5;
    
    // check if there is a state encoded in the query section of the string
    var queryString = document.location.search;
    var urlConditions;
    var urlZoom;
    var urlCenter;
    // if the queryString is greater than 1 character in length, then we can assume that the URL encodes a saved map view
    if (queryString.length > 1) {
        var queryStringVariables;
        var queryStringObj = {};
        queryString = queryString.substring(1); // get rid of the initial '?'
        queryStringVariables = queryString.split('&');
        for (var queryI = 0; queryI < queryStringVariables.length; queryI++) {
            var splitter  = queryStringVariables[queryI].split('=');
            queryStringObj[splitter[0]] = splitter[1];
        }
        urlConditions = decodeURIComponent(queryStringObj.conditions);
        urlZoom = parseInt(queryStringObj.zm);
        urlCenter = new google.maps.LatLng(parseFloat(queryStringObj.ctr.split(',')[0]), parseFloat(queryStringObj.ctr.split(',')[1]));
    }
    
    this._mapOptions = {
        center: ((urlCenter != null) ? urlCenter : defaultCenter),
        zoom: ((urlZoom != null) ? urlZoom : defaultZoom),
        streetViewControl: false,
        rotateControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom: 11,
        minZoom: 5
    };
    
    this._map = new google.maps.Map(document.getElementById(this._mapCanvasId), this._mapOptions);
    this._styles = [
        {
            featureType: "road",
            elementType: "all",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];
    this._map.setOptions({styles: this._styles});
    
    this._geocoder = new google.maps.Geocoder();
    
    //make it so that the user cannot pan away from Japan
    //code adapted from http://stackoverflow.com/questions/3125065/how-do-i-limit-panning-in-google-maps-api-v3?rq=1
    this._allowedBounds = new google.maps.LatLngBounds(new google.maps.LatLng(24, 122.5),
                                                       new google.maps.LatLng((45+(40/60)), 147.5));
    this._lastValidCenter = gajdViewer._map.getCenter();
    google.maps.event.addListener(this._map, 'center_changed', function () {
        if (gajdViewer._allowedBounds.contains(gajdViewer._map.getCenter())) {
            gajdViewer._lastValidCenter = gajdViewer._map.getCenter();
        } else {
            gajdViewer._map.panTo(gajdViewer._lastValidCenter);
        }});
    
    document.getElementById("conditionsCounter").value = 0; // Reset the condition counter. Sometimes the value is retained when the user refreshes the browser window.
    gajdViewer.addFormForCondition();
    if (urlConditions != null) {
        gajdViewer.recreateStateFromJSON(urlConditions);
    }
}

gajdViewer.addFormForCondition = function () {
    var conditionsBoxDiv = document.getElementById("conditionsBox");
    var conditionsCounter = document.getElementById("conditionsCounter");
    var conditionNo = parseInt(conditionsCounter.value) + 1;
    var conditionDiv;
    var newCollectionDropbox;
    var newCollectionOptions;
    var newMapDropbox;
    var newMapDropboxDefault;
    var newFormsSelector;
    var viewFormsAsListSpan;
    var removeConditionButton = document.getElementById("removeCondition");
    
    // update the conditionsCounter
    conditionsCounter.value = conditionNo;
        
    // enable the removeCondition button if the number of conditions is now greater than 1
    if (conditionNo > 1) {
        removeConditionButton.disabled = false;
    }
    
    // make a div for the new condition form and insert it into the div for the conditionsBox
    conditionDiv = document.createElement("div");
    conditionDiv.id = "conditionDiv" + conditionNo;
    conditionDiv.style.margin = "5px";
    conditionDiv.style.borderStyle = "dotted";
    conditionDiv.style.borderWidth = "thin";
    conditionDiv.style.padding = "5px";
    conditionsBoxDiv.appendChild(conditionDiv);    
        
    conditionDiv.appendChild(document.createTextNode("Condition No. " + conditionNo));
    conditionDiv.appendChild(document.createElement("br"));
        
    conditionDiv.appendChild(document.createTextNode("Select map:"));
    newMapDropbox = document.createElement("select");
    newMapDropbox.id = "mapDropbox" + conditionNo;
    newMapDropbox.onchange = function () {gajdViewer.populateFormSelector(conditionNo)};
    newMapDropbox.classsName = "jpntext";
    newMapDropboxDefault = document.createElement("option")
    newMapDropboxDefault.value = 0;
    newMapDropboxDefault.appendChild(document.createTextNode("Map"));
    newMapDropbox.appendChild(newMapDropboxDefault);
    conditionDiv.appendChild(newMapDropbox);
        
    for (var i = 0; i < 350; i++) {
        var optionElement = document.createElement("option");
        optionElement.value = i + 1;
        optionElement.appendChild(document.createTextNode("Map " + (i+1) + ": " + gajdViewer.mapNameList[i].qWord));
        newMapDropbox.appendChild(optionElement);
    }
    
    conditionDiv.appendChild(document.createElement("br"));
    conditionDiv.appendChild(document.createTextNode("Select forms:"));
    newFormsSelector = document.createElement("select");
    newFormsSelector.id = "formSelector" + conditionNo;
    newFormsSelector.multiple = true;
    newFormsSelector.size = 10;
    newFormsSelector.style.verticalAlign = "text-top";
    newFormsSelector.className = "ipastring";
    conditionDiv.appendChild(newFormsSelector);
    
    
    conditionDiv.appendChild(document.createElement("br"));
    viewFormsAsListSpan = document.createElement("span");
    viewFormsAsListSpan.id = "viewFormsAsList" + conditionNo;
    viewFormsAsListSpan.className = "jump_span";
    viewFormsAsListSpan.style.display = "none";
    viewFormsAsListSpan.innerHTML = "View forms for this map as a list."
    viewFormsAsListSpan.onclick = function () {gajdViewer.viewFormsAsList(conditionNo);};
    conditionDiv.appendChild(viewFormsAsListSpan);
}

// This removes the form for setting a condition
gajdViewer.removeFormForCondition = function () {
    var conditionsBoxDiv = document.getElementById("conditionsBox");
    var conditionsCounter = document.getElementById("conditionsCounter");
    var conditionDiv = document.getElementById("conditionDiv" + conditionsCounter.value);
    var removeConditionButton = document.getElementById("removeCondition");
    
    //remove the div that holds the form for the bottom-most condition
    conditionsBoxDiv.removeChild(conditionDiv);
    
    //reduce conditions counter by 1
    conditionsCounter.value = parseInt(conditionsCounter.value) - 1;
    
    //disable the button to remove conditions if we are down to less than 2 conditions
    if (conditionsCounter.value < 2) {
        //if the condition we are removing is the second one in the conditionSet,
        //then disable the remove button
        removeConditionButton.disabled = true;
    }   
}


gajdViewer.populateFormSelector = function (conditionNo) {
    var mapDropbox = document.getElementById("mapDropbox" + conditionNo);
    var mapNo = parseInt(mapDropbox.value);
    var formSelector = document.getElementById("formSelector" + conditionNo);
    var optionElement;
    
    // if this selection box already was populated, and the user changed the map number, then remove all of the options that it was previously populated with 
    while (formSelector.childNodes.length > 0)
    {
        formSelector.removeChild(formSelector.childNodes[0]);
    }
    
    // The following makes sure that the map is loaded (hence the call to gajdViewer.getMap()
    // and then populates the form selector with the headwords and pronunciation forms for the map.
    // The code for populating the form selector is enclosed within a callback passed to getMap().
    // Note that we don't need to do any of this if the user selected the default item in the map
    // selector (the case where mapNo == 0).
    if (mapNo != 0 )
    {
        gajdViewer.getMap(mapNo, function() {
            var dataForMapNo = new Array();
            var hwNo; //iterator for looping through all the headwords
            var prnNo; //iterator for looping through all the pronunciations
            
            dataForMapNo = gajdViewer.mapData[mapNo];
            
            if (dataForMapNo != null) {
                // loop through all the headwords for this map
                for (hwNo in dataForMapNo.hws) {
                    // if there are any locations without pronunciations associated with them for this headword,
                    // then create an option for that headword
                    if (dataForMapNo.hws[hwNo].locs != null) {
                        optionElement = document.createElement("option");
                        optionElement.value = hwNo;
                        optionElement.appendChild(document.createTextNode(hwNo + ": " + dataForMapNo.hws[hwNo].hwForm));
                        formSelector.appendChild(optionElement);
                    }
                    
                    // if there are any pronunciations associated with this headword,
                    // create an option for each pronunciation
                    if (dataForMapNo.hws[hwNo].prns != null) {
                        for (prnNo in dataForMapNo.hws[hwNo].prns) {
                            optionElement = document.createElement("option");
                            optionElement.value = hwNo + ":" + prnNo;
                            optionElement.appendChild(document.createTextNode(hwNo + ":" + prnNo + ": " +
                                                                              dataForMapNo.hws[hwNo].hwForm + " [" +
                                                                              dataForMapNo.hws[hwNo].prns[prnNo].prn + "]"));
                            formSelector.appendChild(optionElement);
                        }
                    }
                }
            }
        });
        
        var viewFormsAsListSpan = document.getElementById("viewFormsAsList" + conditionNo);
        viewFormsAsListSpan.style.display = "inline";
    }
}

gajdViewer.viewFormsAsList = function (conditionNo) {
    var mapDropbox = document.getElementById("mapDropbox" + conditionNo);
    var mapNo = parseInt(mapDropbox.value);
    if (mapNo != 0 ) {
        gajdViewer.toggleShowForms(mapNo);
        document.getElementById("gaj_guide_map" + mapNo).scrollIntoView(true);
    }
    
}


// this function is called when someone presses the button to display locations as a new set/legend item
// it should do the following:
// 1) Check to make sure that everything has been entered to create valid conditions for each condition form.
//    If there is any part of the form that is not properly completed (i.e. a condition where no map or no
//    forms are selected), then this function shall alert the user and do nothing further.
// 2) Extract the conditions from the form to an object of the following structure:
//    {
//      dataSetNo: an integer assigned to this data set
//      conditionSets: an array of condition sets, where each condition set is itself an array of conditions. At the end of this function, it should only hold one array of conditions
//      label: a string representing the label the user gives to this dataset
//      color: a string representing the color the user gives to this dataset for mapping purposes
//    }
//
//    Each condition in the 2-dimensional array conditionSets is an object of the following structure:
//    {
//      mapNo: an integer identifying the map that this condition refers to
//      forms: an array of objects representing the forms selected by the user on the map in question
//    }
// 3) Push the object holding the extracted and sorted conditionSets to gajdViewer.conditionsForDataSets
// 4) Reset the form that was used to select this data set.
// 5) Add an option to add more locations to this data set to the form below the map.
// Disabled: 6) Note all the maps referenced by this dataSet in gajdViewer.gajdMapsGraphed    
// 7) Call support methods to find and display all the data that match the conditions specified and put in a new legend entry
// 8) Scroll the window to the top of the page
gajdViewer.extractNewSetFromForm = function () {
    var dataSetNo = gajdViewer.dataSets.length;
    var newDataSet = {};
    var conditionI = 1; //iterator for processing the conditions
    var numberOfConditions = parseInt(document.getElementById("conditionsCounter").value);
    var mapDropbox;
    var formSelector;
    var dataSetLabel = document.getElementById("newLegendLabel").value;
    var dataSetColor = document.getElementById("markerColor").value;
    var colorRegExp = /^#[A-Fa-f0-9]{6}/; //regular expression for testing whether or not a string represents a hexidecimal RGB color code
    var formI;  //iterator for processing the forms within each condition
    var newForm; // to hold the array when we split the selected form into its hwNo and prnNo components
    var conditionTestValue; // used to hold the result returned by the support method that checks that all conditions were properly entered
    
    // 1) Validate form input
    // First, check that a label was properly entered
    if (dataSetLabel.length == 0) {
        alert("You must enter a label for the new legend entry!");
        return null;
    }
    // Check that all the conditions were properly set
    conditionTestValue = gajdViewer.checkConditionsInForm();
    if (conditionTestValue) {
        alert("You did not enter a valid condition in the form for Condition No. " + conditionTestValue + ". " +
              "You must select a GAJ map and at least one form on that map for each condition.");
        return null;
    }
    
    // 2) Extract the conditions from the form to an object of the following structure:
    //    {
    //      dataSetNo: an integer assigned to this data set
    //      conditionSets: an array of condition sets, where each condition set is itself an array of conditions
    //                     This will only have one element in the set after this function
    //      label: a string representing the label the user gives to this dataset
    //      color: a string representing the color the user gives to this dataset for mapping purposes
    //    }
    //
    //    Each condition in the 2-dimensional array conditionSets is an object of the following structure:
    //    {
    //      mapNo: an integer identifying the map that this condition refers to
    //      forms: an array of objects of represent forms selected by the user for the map in question.
    //             those objects are of the structure below.
    //             { hwNo, prnNo: string, null if not selected }
    //    }
    newDataSet.dataSetNo = dataSetNo;
    newDataSet.label = dataSetLabel;
    if (!colorRegExp.test(dataSetColor)) {
        //if the color selected by the user does not match the pattern for a color,
        //then assign one for the user
        switch (dataSetNo) {
            default:
                dataSetColor = '#FF0000'; //red
                break;
            case 1:
                dataSetColor = '#00FF00'; //green
                break;
            case 2:
                dataSetColor = '#0000FF'; //blue
                break;
            case 3:
                dataSetColor = '#FFFF00'; //yellow
                break;
            case 4:
                dataSetColor = '#00FFFF'; //teal
                break;
            case 5:
                dataSetColor = '#FF8000'; //orange
                break;
            case 6:
                dataSetColor = '#800080'; //purple
                break;
            case 7:
                dataSetColor = '#FF00FF'; //pink
                break;
            case 8:
                dataSetColor = '#808080'; //grey
                break;
        }
    }
    newDataSet.color = dataSetColor;
    newDataSet.conditionSets = [];
    
    
    newDataSet.conditionSets.push([]); // add a new array to hold the conditions for the condition set
    numberOfConditions = parseInt(document.getElementById("conditionsCounter").value);
    for (conditionI = 1; conditionI <= numberOfConditions; conditionI++) {
        // add a new object to hold the individual condition
        newDataSet.conditionSets[0].push({});
        
        mapDropbox = document.getElementById("mapDropbox" + conditionI);
        formSelector = document.getElementById("formSelector" + conditionI);
            
        newDataSet.conditionSets[0][conditionI-1].mapNo = parseInt(mapDropbox.value);
            
        newDataSet.conditionSets[0][conditionI-1].forms = [];
        
        //loop through all the options in the form selector, and extract only the 
        for (formI = 0; formI < formSelector.length; formI++)
        {
            if (formSelector.options[formI].selected) {
                newForm = formSelector.options[formI].value.split(":");
                // first push an empty object, then set the hwNo and prnNo attributes of that object.
                newDataSet.conditionSets[0][conditionI-1].forms.push({hwNo: newForm[0],
                                                                    prnNo: newForm[1]});
            }
        }
    }
    
    // 3) Push the object holding the extracted and sorted conditionSets to gajdViewer.conditionsForDataSets
    gajdViewer.conditionsForDataSets.push(newDataSet);
    
    // 4) Reset the form that was used to select the conditions
    gajdViewer.resetForm();
    
    // 5) Add an option to add more locations to this data set to the form below the map.
    // first, get the dropdown element and the submit button
    gajdViewer.addOptionToAddToExistingSet(dataSetNo, dataSetLabel);
    gajdViewer.addOptionToExportSet(dataSetNo, dataSetLabel);
    
    //// 6) Note all the maps referenced by this dataSet in gajdViewer.gajdMapsGraphed
    //for (conditionSetI = 0; conditionSetI < newDataSet.conditionSets.length; conditionSetI++)
    //{
    //    for (conditionI = 0; conditionI < newDataSet.conditionSets[conditionSetI].length; conditionI++)
    //    {
    //        if (!(newDataSet.conditionSets[conditionSetI][conditionI].mapNo in gajdViewer.gajdMapsGraphed))
    //        {
    //            gajdViewer.gajdMapsGraphed[newDataSet.conditionSets[conditionSetI][conditionI].mapNo] = [];
    //            gajdViewer.gajdMapsGraphed[newDataSet.conditionSets[conditionSetI][conditionI].mapNo].push(dataSetNo);
    //        }
    //        else if (gajdViewer.gajdMapsGraphed[newDataSet.conditionSets[conditionSetI][conditionI].mapNo].indexOf(dataSetNo) != -1)
    //        {
    //            gajdViewer.gajdMapsGraphed[newDataSet.conditionSets[conditionSetI][conditionI].mapNo].push(dataSetNo);
    //        }
    //    }
    //}
    
    // 7) Call support methods to find and display all the data that match the conditions specified and put in a new legend entry
    gajdViewer.getLocationsForDataSet(dataSetNo);
    gajdViewer.mapLocationSet(dataSetNo);
    gajdViewer.addLegendEntry(dataSetNo);
    
    // 8) Scroll the window to the top of the page
    window.scroll(0, 0);
    
    return true;
}

//Adds an option to the drop-down menu for selecting an existing Legend Entry according to which more locations should be marked
gajdViewer.addOptionToAddToExistingSet = function (dataSetNo, dataSetLabel) {
    var legendEntrySelectMenu = document.getElementById("existingLegendLabel");
    var addToExistingSetButton = document.getElementById("addToExistingSet");
    
    var newLegendEntryOption = document.createElement("option");
    newLegendEntryOption.value = dataSetNo;
    newLegendEntryOption.id = "existingLegendLabelOption" + dataSetNo;
    newLegendEntryOption.appendChild(document.createTextNode((dataSetNo + 1) + ": " + dataSetLabel));
    
    legendEntrySelectMenu.appendChild(newLegendEntryOption);
    
    // enable the dropdown menu and the submit button if they are disabled
    addToExistingSetButton.disabled = false;
    legendEntrySelectMenu.disabled = false;
}

gajdViewer.addOptionToExportSet = function (dataSetNo, dataSetLabel) {
    var legendEntrySelectMenu = document.getElementById("exportSelect");
    var exportButton = document.getElementById("exportButton");
    
    var newLegendEntryOption = document.createElement("option");
    newLegendEntryOption.value = dataSetNo;
    newLegendEntryOption.id = "exportOption" + dataSetNo;
    newLegendEntryOption.appendChild(document.createTextNode((dataSetNo + 1) + ": " + dataSetLabel));
    
    legendEntrySelectMenu.appendChild(newLegendEntryOption);
    
    // enable the dropdown menu and the submit button if they are disabled
    exportButton.disabled = false;
    legendEntrySelectMenu.disabled = false;
}

gajdViewer.resetForm = function () {
    var conditionsCounter = document.getElementById("conditionsCounter");
    while (parseInt(conditionsCounter.value) > 0) {
        gajdViewer.removeFormForCondition();
    }
    gajdViewer.addFormForCondition();
    document.getElementById("newLegendLabel").value = null;
    document.getElementById("markerColor").value = null;
}

// This function makes sure that the forms for selecting conditions are completed
// returns 0 if they are all entered correctly, otherwise it returns the number of the first condition that was not validly entered
gajdViewer.checkConditionsInForm = function () {
    var badConditionNo = 0;
    var conditionI;
    var mapDropbox;
    var formSelector;
    var numberOfConditions = parseInt(document.getElementById("conditionsCounter").value);
    for (conditionI = 1; conditionI <= numberOfConditions && badConditionNo == 0; conditionI++)
    {
        mapDropbox = document.getElementById("mapDropbox" + conditionI);
        formSelector = document.getElementById("formSelector" + conditionI);
        if (
            parseInt(mapDropbox.value) < 1 ||
            parseInt(mapDropbox.value) > 350 ||
            formSelector.selectedIndex == "-1"
        )
        {
            badConditionNo = conditionI;
        }
    }
    return badConditionNo;
}

// This function is called when the user presses the button to add locations matching a set of conditions in the form
// to an existing set of locations corresponding 
// it should do the following:
// 1) Check to make sure that everything has been entered to create valid conditions for each condition form.
//    If there is any part of the form that is not properly completed (i.e. a condition where no map or no
//    forms are selected), then this function shall alert the user and do nothing further.
// 1.5) Get the number of the dataSet we are adding a new set of conditions (and matching locations) to
//      and set variables relating to that data set
// 2) Extract the conditions from the form to an array of conditions of the following form:
//    {
//      mapNo: an integer identifying the map that this condition refers to
//      forms: an array of objects of represent forms selected by the user for the map in question.
//             those objects are of the structure below.
//             { hwNo, prnNo: string, null if not selected }
//    }
//
//    Add this array of conditions to gajdViewer.conditionsForDataSets[dataSetNo].conditionSets
//    Note that elements of the array gajdViewer.conditionsForDataSets are objects of the following structure:
//    {
//      dataSetNo: an integer assigned to this data set
//      conditionSets: an array of condition sets, where each condition set is itself an array of conditions
//      label: a string representing the label the user gives to this dataset
//      color: a string representing the color the user gives to this dataset for mapping purposes
//    }
//
// 4) Reset the form that was used to select the conditions. 
// 7) Call support methods to remove all the locations for this legend entry from the map and from memory,
//    then repopulate and display the locations for this legend entry
// 8) Scroll the window to the top of the page
gajdViewer.addToExistingSetFromForm = function () {
    var dataSetNo;
    var conditionSetNo;
    var conditionI = 1; //iterator for processing the conditions
    var numberOfConditions = parseInt(document.getElementById("conditionsCounter").value);
    var mapDropbox;
    var formSelector;
    var formI;  //iterator for processing the forms within each condition
    var newForm; // to hold the array when we split the selected form into its hwNo and prnNo components
    var conditionTestValue; // used to hold the result returned by the support method that checks that all conditions were properly entered
    
    // 1) Validate form input
    // Check that all the conditions were properly set
    conditionTestValue = gajdViewer.checkConditionsInForm();
    if (conditionTestValue) {
        alert("You did not enter a valid condition in the form for Condition No. " + conditionTestValue + ". " +
              "You must select a GAJ map and at least one form on that map for each condition.");
        return null;
    }
    
    // 1.5) Get the number of the dataSet we are adding a new set of conditions (and matching locations) to
    dataSetNo = parseInt(document.getElementById("existingLegendLabel").selectedOptions[0].value);
    conditionSetNo = gajdViewer.conditionsForDataSets[dataSetNo].conditionSets.length;
    
    // 2) Extract the conditions from the form to an array of conditions of the following form:
    //    {
    //      mapNo: an integer identifying the map that this condition refers to
    //      forms: an array of objects of represent forms selected by the user for the map in question.
    //             those objects are of the structure below.
    //             { hwNo, prnNo: string, null if not selected }
    //    }
    //
    //    Add this array of conditions to gajdViewer.conditionsForDataSets[dataSetNo].conditionSets
    //    Note that elements of the array gajdViewer.conditionsForDataSets are objects of the following structure:
    //    {
    //      dataSetNo: an integer assigned to this data set
    //      conditionSets: an array of condition sets, where each condition set is itself an array of conditions
    //      label: a string representing the label the user gives to this dataset
    //      color: a string representing the color the user gives to this dataset for mapping purposes
    //    }
    //
    
    gajdViewer.conditionsForDataSets[dataSetNo].conditionSets.push([]); // add a new array to hold the conditions for the condition set
    for (conditionI = 1; conditionI <= numberOfConditions; conditionI++) {
        // add a new object to hold the individual condition
        gajdViewer.conditionsForDataSets[dataSetNo].conditionSets[conditionSetNo].push({});
        
        mapDropbox = document.getElementById("mapDropbox" + conditionI);
        formSelector = document.getElementById("formSelector" + conditionI);
        
        gajdViewer.conditionsForDataSets[dataSetNo].conditionSets[conditionSetNo][conditionI-1].mapNo = parseInt(mapDropbox.value);
            
        gajdViewer.conditionsForDataSets[dataSetNo].conditionSets[conditionSetNo][conditionI-1].forms = [];
        for (formI = 0; formI < formSelector.length; formI++)
        {
            if (formSelector.options[formI].selected) {
                newForm = formSelector.options[formI].value.split(":");
                // first push an empty object, then set the hwNo and prnNo attributes of that object.
                gajdViewer.conditionsForDataSets[dataSetNo].conditionSets[conditionSetNo][conditionI-1].forms.push({hwNo: newForm[0],
                                                                                                                    prnNo: newForm[1]});
            }
        }
    }
    
    
    // 4) Reset the form that was used to select the conditions
    gajdViewer.resetForm();
    
    // 7) Call support methods to remove all the locations for this legend entry from the map and from memory,
    //    then repopulate and display the locations for this legend entry
    gajdViewer.removeLocationsForDataSet(dataSetNo);
    gajdViewer.getLocationsForDataSet(dataSetNo);
    gajdViewer.mapLocationSet(dataSetNo);
    
    // 8) Scroll the window to the top of the page
    window.scroll(0, 0);
    
    return true;
}




// Stores an array of objects containing locations that match all the condition sets for dataSetNo
// This function requires that all maps referenced in the condition already be loaded.
gajdViewer.getLocationsForDataSet = function (dataSetNo) {
    // In order to generate an array of locations (and their relevant information)
    // that matches any of the condition sets for our data set,
    // we must first go through each condition set one by one,
    // and within each condition set we must go through each condition one by one.
    // For each condition, we must pull all the locations together into one array of objects
    // of all matching locations and their mapNo + response (response / note code / note) + form data (hwNo / prnNo).
    // Once this is done for every condition in the condition set,
    // we then AND-join the data collected for each condition.
    // Note the easiest way to do a join is to use locations codes as the keys of an associative array.
    //
    // Once this is done for every condition set, we then OR join the data for each condition set.
    
    var conditionSetI;
    var conditionI;
    var formI;
    var locationI;
    var newLocation; 
    var conditionSets = gajdViewer.conditionsForDataSets[dataSetNo].conditionSets;
    var currentConditionSet;
    var currentCondition;
    var locationsForSingleCondition;
    var locationsForSingleConditionSet; // a variable to act as an array to hold all of the associative arrays for each condition in a given condition set
    gajdViewer.dataSets[dataSetNo] = [];
    
    //loop through all the condition sets to get the locations for each condition set
    for (conditionSetI = 0; conditionSetI < conditionSets.length; conditionSetI++) {
        currentConditionSet = conditionSets[conditionSetI];
        locationsForSingleConditionSet = [];
        
        //loop through all the conditions in this set, pulling their location data one at a time
        for (conditionI = 0; conditionI < currentConditionSet.length; conditionI++) {
            currentCondition = currentConditionSet[conditionI];
            locationsForSingleCondition = gajdViewer.getLocationsForCondition(currentCondition.mapNo,
                                                                              currentCondition.forms);            
            locationsForSingleConditionSet.push(locationsForSingleCondition);
        }
        gajdViewer.dataSets[dataSetNo][conditionSetI] = gajdViewer.andJoinArraysOfLocations(locationsForSingleConditionSet);
        
    }
    
    gajdViewer.dataSets[dataSetNo] = gajdViewer.orJoinArraysOfLocations(gajdViewer.dataSets[dataSetNo]);
}

// returns an array of all the locations that match a condition and their forms as an associative array
// with location numbers as keys
//
// conditionMapNo should be an integer.
// forms should be an array of objects of the structure: {hwNo: string, prnNo: string/null}
gajdViewer.getLocationsForCondition = function (conditionMapNo, forms) {
    var joinedLocations = {}; // this is where we will collect all the locations
    var myMapData = gajdViewer.mapData[conditionMapNo];
    var formI;
    var locI;
    var currentHwNo;
    var currentPrnNo;
    var currentLocation;
    var locationsForForm; // this will hold the locations associated with just the single form
    var newLocationInfo;
    
    // loop through all the forms selected and add them to the collection we are building
    for (formI = 0; formI < forms.length; formI++) {
        currentHwNo = forms[formI].hwNo;
        currentPrnNo = forms[formI].prnNo;
        if (currentPrnNo) {
            locationsForForm = myMapData.hws[currentHwNo].prns[currentPrnNo].locs;
        } else {
            locationsForForm = myMapData.hws[currentHwNo].locs;
        }

        
        // for every form, loop through all the locations associated with that form.
        for (locI = 0; locI < locationsForForm.length; locI++) {
            currentLocation = locationsForForm[locI];
            // Make an object to hold the info at for the location (mapNo, hwNo, prnNo, rsp, noteCode, and note properties)
            newLocationInfo = { 
                                mapNo: conditionMapNo,
                                hwNo: currentHwNo,
                                prnNo: currentPrnNo,
                                rsp: currentLocation.rsp,
                                noteCode: currentLocation.noteCode,
                                note: currentLocation.note
                              };
                                
            if (joinedLocations[currentLocation.locNo]) {
                // if the same location has multiple forms associated with it for one map,
                // we should combine both responses as long as they both match
                joinedLocations[currentLocation.locNo].push(newLocationInfo);
            } else {
                // If the location is not present in the associative array we are creating,
                // then we need to add it.
                joinedLocations[currentLocation.locNo] = [];
                joinedLocations[currentLocation.locNo].push(newLocationInfo);
            }
        }
    }
    return joinedLocations;
}

// returns an associative array of all the locations that results from an AND join of an array of
// associative arrays of locations.
gajdViewer.andJoinArraysOfLocations = function (unjoinedData) {
    var joinedData = unjoinedData[0];
    var tempArray;
    var swapContainer;
    var i;

    for (i = 1; i < unjoinedData.length && Object.keys(joinedData).length > 0; i++) {
        tempArray = unjoinedData[i];
        
        // We want to loop through the keys of the shorter associative array.
        // Swap them if necessary to ensure this.
        if (Object.keys(joinedData).length > Object.keys(tempArray).length) {
            swapContainer = tempArray;
            tempArray = joinedData;
            joinedData = swapContainer;
        }
        
        //loop through all the keys (location numbers) in the shorter array
        for (var locNo in joinedData) {
            if (tempArray[locNo]) {
                //if the longer array has data for that location,
                //then add that data to the data in the shorter array
                joinedData[locNo] = joinedData[locNo].concat(tempArray[locNo]);
            } else {
                //if the longer array does not have any data for a given location,
                //then delete that location from the shorter array
                delete joinedData[locNo]; //this may be causing side effects on the argument
            }
        }
    }
    
    return joinedData;
}

// returns an associative array of all the locations that results from an OR join of an array of
// associative arrays of locations.
gajdViewer.orJoinArraysOfLocations = function (unjoinedData) {
    var joinedData = unjoinedData.pop();
    var tempArray;
    var swapContainer;

    while (unjoinedData.length > 0) {
        tempArray = unjoinedData.pop();
        
        // We want to loop through the keys of the shorter associative array (to transfer them to the larger array).
        // Swap them if necessary to ensure this.
        if (Object.keys(joinedData).length < Object.keys(tempArray).length) {
            swapContainer = tempArray;
            tempArray = joinedData;
            joinedData = swapContainer;
        }
        
        //loop through all the keys (location numbers) in the shorter array
        for (var locNo in tempArray) {
            if (joinedData[locNo]) {
                //if the longer array has data for that location,
                //then add that data to the data in the shorter array
                joinedData[locNo] = joinedData[locNo].concat(tempArray[locNo]);
            } else {
                //if the longer array does not have any data for a given location,
                //then assign the new data from the shorter array
                joinedData[locNo] = tempArray[locNo];
            }
        }
    }
    
    return joinedData;
}

// removes all the markings for a legend entry corresponding to dataSetNo from a map
// as well as all the locations for that set from memory;
gajdViewer.removeLocationsForDataSet = function (dataSetNo) {
    var overlayI;
    for (overlayI = 0; overlayI < gajdViewer.overlaysForDataSets[dataSetNo].length; overlayI++) {
        gajdViewer.overlaysForDataSets[dataSetNo][overlayI].setMap(null); //remove rectangle from map
        gajdViewer.overlaysForDataSets[dataSetNo][overlayI] = null; //delete rectangle from memory
    }
    gajdViewer.dataSets[dataSetNo] = null; //eliminate the locations in this data set from memory
    gajdViewer.overlaysForDataSets[dataSetNo] = null; //eliminate the array that held the rectangle overlays
}

// Binary search to find the index for the first mapNo:form tuple in formArray where the mapNo of the tuple equals mapNumber
// Returns null if there is no corresponding tuple.
// algorithm adapted from http://en.wikipedia.org/wiki/Binary_search_algorithm
gajdViewer.findFirstFormForMap = function (formArray, mapNumber, imin, imax) {
    var imid
    // test if array is empty
    while (imax >= imin)
    {
        // calculate midpoint to cut the set in half
        imid = imin + Math.floor((imin + imax) / 2);
        
        // three-way comparison
        if (formArray[imid].mapNo > mapNumber)
        {
            // key is in lower subset
            imax = imid - 1;
        }
        else if (formArray[imid].mapNo < mapNumber)
        {
            // key is in upper subset
            imin = imid + 1;
        }
        else
        {// key has been found
            // go to the first entry for the mapNumber
            while (imid > 0 && formArray[imid - 1].mapNo == mapNumber)
            {
                imid = imid - 1;
            }
            return imid;
        }
    }
    // set is empty, so return null.
    return null;
}

//Marks all the locations in the for dataSetNo onto the google map
gajdViewer.mapLocationSet = function (dataSetNo) {
    gajdViewer.overlaysForDataSets[dataSetNo] = [];
    var locNo;
    
    for (locNo in gajdViewer.dataSets[dataSetNo]) {
        gajdViewer.overlaysForDataSets[dataSetNo].push(gajdViewer.mapSingleLocation(locNo, dataSetNo));
    }
}

gajdViewer.mapSingleLocation = function (locationNo, dataSetNo) {
    var rectOverlay = new google.maps.Rectangle({
        bounds: new google.maps.LatLngBounds(gajdViewer.getSWCorner(locationNo), gajdViewer.getNECorner(locationNo)),
	clickable: true,
	editable: false,
	fillColor: gajdViewer.conditionsForDataSets[dataSetNo].color,
        fillOpacity: gajdViewer.markerOpacity,
	map: gajdViewer._map,
	strokeColor: gajdViewer.conditionsForDataSets[dataSetNo].color,
	strokeOpacity: gajdViewer.markerOpacity,
	strokePosition: google.maps.StrokePosition.CENTER,
	strokeWeight: 1,
	visible: true,
        zIndex: dataSetNo
	});
    rectOverlay.gajdLocNo = locationNo;
    google.maps.event.addListener(gajdViewer._map, 'zoom_changed', function () {gajdViewer.adjustRectangleToViewLevel(rectOverlay);});
    google.maps.event.addListener(rectOverlay, 'click', function () {gajdViewer.displayInformationForLocation(locationNo)});
    gajdViewer.adjustRectangleToViewLevel(rectOverlay);
    return rectOverlay;
}

gajdViewer.adjustRectangleToViewLevel = function (rectOverlay) {
    // no change to size at zoom 10-11
    // double size at 9
    var scale = 1;
    switch (gajdViewer._map.getZoom()) {
        case 5:
            scale = 6;
            break;
        case 6:
            scale = 5;
            break;
        case 7:
            scale = 4;
            break;
        case 8:
            scale = 3;
            break;
        case 9:
            scale = 2;
            break;
        case 10:
        case 11:
        default:
            scale = 1;
            break;
    }
    rectOverlay.setBounds(new google.maps.LatLngBounds(gajdViewer.getSWCorner(rectOverlay.gajdLocNo, scale),
                                                       gajdViewer.getNECorner(rectOverlay.gajdLocNo, scale)));
}

// returns a number representing the latitude of the center of 'box' on a GAJD map corresponding the locNo argument
gajdViewer.getCenterLat = function (locNo) {
    if (gajdViewer.locationLatLngs[locNo]) {
        return gajdViewer.locationLatLngs[locNo].lat;
    } else {
        var latNo = locNo.charAt(0) + locNo.charAt(2) + locNo.charAt(4);
        var upperLatitudeOfGrid = (45 + (40 / 60));
        var lowerLatitudeOfGrid = 29;
        if (locNo.substr(0, 2) == "02" ||
            locNo.substr(0, 2) == "11" ||
            locNo.substr(0, 2) == "12" ||
            locNo.substr(0, 2) == "20" ||
            locNo.substr(0, 2) == "21")
        {
            latNo = "1" + latNo;
        }
        
        return upperLatitudeOfGrid - ((upperLatitudeOfGrid - lowerLatitudeOfGrid) * (parseInt(latNo) + 0.5) / 1000);
    }
}

// returns a number representing the longitude of the center of 'box' on a GAJD map corresponding the locNo argument
gajdViewer.getCenterLng = function (locNo) {
    if (gajdViewer.locationLatLngs[locNo]) {
        return gajdViewer.locationLatLngs[locNo].lng;
    } else {
        var lngNo = locNo.charAt(1) + locNo.charAt(3) + locNo.charAt(5);
        return 122.5 + ((147.5 - 122.5) * (parseInt(lngNo) + 0.5) / 1000);
    }
}


// returns a google.maps.LatLng object for the south west corner of one of the 'boxes' on a GAJD map corresponding the locNo argument
gajdViewer.getSWCorner = function (locNo, scale) {
    if (arguments.length == 1) {
        scale = 1;
    }
    
    var latOfCenter = gajdViewer.getCenterLat(locNo);
    var latOfCorner = latOfCenter - (gajdViewer.GAJ_MESH_CELL_HEIGHT * scale / 2);
    
    var lngOfCenter = gajdViewer.getCenterLng(locNo);
    var lngOfCorner = lngOfCenter - (gajdViewer.GAJ_MESH_CELL_WIDTH * scale / 2);
    
    return new google.maps.LatLng(latOfCorner, lngOfCorner);
}

// returns a google.maps.LatLng object for the north east corner of one of the 'boxes' on a GAJD map corresponding the locNo argument
gajdViewer.getNECorner = function (locNo, scale) {
    if (arguments.length == 1) {
        scale = 1;
    }
    
    var latOfCenter = gajdViewer.getCenterLat(locNo);
    var latOfCorner = latOfCenter + (gajdViewer.GAJ_MESH_CELL_HEIGHT * scale / 2);
    
    var lngOfCenter = gajdViewer.getCenterLng(locNo);
    var lngOfCorner = lngOfCenter + (gajdViewer.GAJ_MESH_CELL_WIDTH * scale / 2);
    
    return new google.maps.LatLng(latOfCorner, lngOfCorner);
}

// Adds a entry into the Legend on the page corresponding to the data assigned to dataSetNo
gajdViewer.addLegendEntry = function (dataSetNo) {
    var legendDiv = document.getElementById(gajdViewer._legendContainerId);
    
    var newLegendRow = document.createElement("p");
    newLegendRow.id = "legend_row" + dataSetNo;
    newLegendRow.className = "legend_entry";
    legendDiv.appendChild(newLegendRow);
    
    var colorBlock = document.createElement("span");
    colorBlock.innerHTML = "■ ";
    colorBlock.title = "Click here to change the color for this legend entry and all matching markings.";
    colorBlock.id = "color_block" + dataSetNo;
    colorBlock.onclick = function () {gajdViewer.enableColorChangeForm(dataSetNo, gajdViewer.conditionsForDataSets[dataSetNo].color);}
    colorBlock.style.color = gajdViewer.conditionsForDataSets[dataSetNo].color;
    newLegendRow.appendChild(colorBlock);
    
    var labelSpan = document.createElement("span");
    labelSpan.id = "label" + dataSetNo;
    labelSpan.title = "Click here to change the label for this legend entry.";
    labelSpan.onclick = function () {gajdViewer.enableLabelChangeForm(dataSetNo, gajdViewer.conditionsForDataSets[dataSetNo].label);}
    labelSpan.innerHTML = gajdViewer.conditionsForDataSets[dataSetNo].label.replace(/&/g, "&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    newLegendRow.appendChild(labelSpan);
    
    var deleteSet = document.createElement("span");
    deleteSet.id = "delete_set" + dataSetNo;
    deleteSet.title = "Click here to remove this legend entry and corresponding markings on the map.";
    deleteSet.onclick = function () {gajdViewer.deleteSetConfirm(dataSetNo, gajdViewer.conditionsForDataSets[dataSetNo].label);};
    deleteSet.innerHTML = "[x]";
    deleteSet.className = "delete_set_x";
    deleteSet.href = "#";
    newLegendRow.appendChild(deleteSet);
}

gajdViewer.enableColorChangeForm = function (dataSetNo, color) {
    var colorSpan = document.getElementById("color_block" + dataSetNo);
    var legendRow = document.getElementById("legend_row" + dataSetNo);
    var labelSpan = document.getElementById("label" + dataSetNo);
    
    var newColorInput = document.createElement("input");
    newColorInput.type = "color";
    newColorInput.id = "newColorInput" + dataSetNo;
    newColorInput.value = color;
    //newColorInput.onblur = function () {gajdViewer.changeColor(dataSetNo)};
    newColorInput.onchange = function () {gajdViewer.changeColor(dataSetNo)};
    
    legendRow.insertBefore(newColorInput, labelSpan);
    colorSpan.innerHTML = "";
    //legendRow.focus();
}

gajdViewer.changeColor = function (dataSetNo) {
    var colorSpan = document.getElementById("color_block" + dataSetNo);
    var legendRow = document.getElementById("legend_row" + dataSetNo);
    var newColorInput = document.getElementById("newColorInput" + dataSetNo);
    var colorRegExp = /^#[A-Fa-f0-9]{6}/;
    
    if (colorRegExp.test(newColorInput.value)) {
        colorSpan.style.color = newColorInput.value;
        gajdViewer.conditionsForDataSets[dataSetNo].color = newColorInput.value;
        
        for (var i = 0; i < gajdViewer.overlaysForDataSets[dataSetNo].length; i++) {
            gajdViewer.overlaysForDataSets[dataSetNo][i].setOptions({fillColor: newColorInput.value, strokeColor: newColorInput.value});
        }
    }
    legendRow.removeChild(newColorInput);
    colorSpan.innerHTML = "■ ";
}

gajdViewer.enableLabelChangeForm = function (dataSetNo, labelText) {
    var labelSpan = document.getElementById("label" + dataSetNo);
    var legendRow = document.getElementById("legend_row" + dataSetNo);
    var newLabelInput = document.createElement("input");
    newLabelInput.type = "text";
    newLabelInput.id = "newLabelInput" + dataSetNo;
    newLabelInput.value = labelText;
    newLabelInput.onblur = function () {gajdViewer.changeLabelText(dataSetNo)};
    legendRow.insertBefore(newLabelInput, labelSpan);
    labelSpan.innerHTML = "";
    legendRow.focus();
}

//this function is triggered when the user changes the text of a legend entry
gajdViewer.changeLabelText = function (dataSetNo) {
    var labelSpan = document.getElementById("label" + dataSetNo);
    var legendRow = document.getElementById("legend_row" + dataSetNo);
    var newLabelInput = document.getElementById("newLabelInput" + dataSetNo);
    var addToExistingLegendOption = document.getElementById("existingLegendLabelOption" + dataSetNo);
    var exportSetOption = document.getElementById("exportOption" + dataSetNo);
    
    //change the label in the legend
    labelSpan.innerHTML = newLabelInput.value;
    gajdViewer.conditionsForDataSets[dataSetNo].label = newLabelInput.value;
    legendRow.removeChild(newLabelInput);
    
    //change the label in the form for marking new locations according to this legend entry;
    addToExistingLegendOption.innerHTML = (parseInt(dataSetNo) + 1) + ": " + newLabelInput.value.replace(/&/g, "&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    exportSetOption.innerHTML = (parseInt(dataSetNo) + 1) + ": " + newLabelInput.value.replace(/&/g, "&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

//This function is triggered when the user clicks on the [x] at the end of a legend entry.
//This function asks the user if he or she would like really like to delete the legend entry
//and all corresponding marked locations from the map.
gajdViewer.deleteSetConfirm = function (dataSetNo, dataSetLabel) {
    if (window.confirm("Do you want delete the legend entry No. " + (dataSetNo + 1) + " \"" + dataSetLabel + "\" and remove all corresponding markings from the map?")) {
        gajdViewer.removeDataSet(dataSetNo);
    }
}

gajdViewer.displayInformationForLocation = function (locationNo) {

    var locationInfoWindow;
    var locationInfoWindowContent = document.createElement("div");
    
    var tableElement = document.createElement("table");
    tableElement.className = "inspector_location_table";
    
    var outerDivElement = document.createElement("div");
    outerDivElement.className = "inspector_legend_entry_outer_div";     
    
    var locationName;
    var ipaResponse;
    
    this._geocoder.geocode({'latLng': new google.maps.LatLng(gajdViewer.getCenterLat(locationNo), gajdViewer.getCenterLng(locationNo)),
                           'region': 'ja'},
                           function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1] && results[1].formatted_address != "Japan") {
                locationName = results[1].formatted_address;
            } else if (results[0]) {
                locationName = results[0].formatted_address;
            }
        } 
    
        //first, display the information about the location
        tableElement.innerHTML = "<tr><th id=\"inspector_location_info_header\" colspan=\"2\">Location No. " + locationNo + "</th></tr>" +
                                 "<tr class=\"inspector_location_row_cell\"><td class=\"inspector_location_row_cell\">Latitude</td><td class=\"inspector_location_row_cell\">" + (Math.round(gajdViewer.getCenterLat(locationNo)*10000)/10000) + "</td></tr>" +
                                 "<tr class=\"inspector_location_row_cell\"><td class=\"inspector_location_row_cell\">Longitude</td><td class=\"inspector_location_row_cell\">" + (Math.round(gajdViewer.getCenterLng(locationNo)*10000)/10000) + "</td></tr>" +
                                 ((locationName) ? "<tr class=\"inspector_location_row_cell\" title=\"This is the address of the location according to the Geocoder service provided by Google Maps. It is not the form of the address used at the time the data was collected.\"><td class=\"inspector_location_row_cell\">Address</td><td>" + locationName + "</td></tr>": "");
        locationInfoWindowContent.appendChild(tableElement);
        
        
        var divElement;
        
        // loop through each set of locations
        for (var dataSetI = 0; dataSetI < gajdViewer.dataSets.length; dataSetI++) {
            if (gajdViewer.dataSets[dataSetI][locationNo]) { //if there is an entry for the location in that data set, put the display the corresponding info
                divElement = document.createElement("div");
                divElement.className = "inspector_legend_entry_no_div"; 
                divElement.innerHTML = divElement.innerHTML + "<h4 class=\"inspector_legend_entry_no_header\">Data relating to Legend Entry No. " + (dataSetI+1) + ": " +
                                                        gajdViewer.conditionsForDataSets[dataSetI].label.replace(/&/g, "&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;") + "</h4>";
                for (var datumI = 0; datumI < gajdViewer.dataSets[dataSetI][locationNo].length; datumI++) {
                    var mapNo = gajdViewer.dataSets[dataSetI][locationNo][datumI].mapNo;
                    var mapName = gajdViewer.mapNameList[parseInt(mapNo)-1].qWord;
                    var hwNo = gajdViewer.dataSets[dataSetI][locationNo][datumI].hwNo;
                    var hwForm = gajdViewer.mapData[mapNo].hws[hwNo].hwForm;
                    var prnNo = gajdViewer.dataSets[dataSetI][locationNo][datumI].prnNo;
                    var prnForm = (prnNo != undefined) ? gajdViewer.mapData[mapNo].hws[hwNo].prns[prnNo].prn : null;
                    var rsp = gajdViewer.convertResponseToIPA(gajdViewer.dataSets[dataSetI][locationNo][datumI].rsp);
                    var note = gajdViewer.dataSets[dataSetI][locationNo][datumI].note;
                    var noteCode = gajdViewer.dataSets[dataSetI][locationNo][datumI].noteCode;
                    var convertedNoteCodes = gajdViewer.convertNoteCodesToText(noteCode);
                    var formCode = (prnNo != undefined) ? (hwNo + ":" + prnNo) : hwNo;
                    var form = (prnNo != undefined) ? (hwForm + " [" + prnForm + "]") : hwForm;
                    var tempHTML = "";
                    
                    tempHTML += "<table class=\"inspector_map_table\" style=\"border-collapse: collapse;\">" +
                                         "<tr title=\"This is the GAJ map that the data in this table comes from.\"><td class=\"inspector_map_cell\">Map</td><td class=\"inspector_map_cell jpntext\">" + mapNo + ": " + mapName + "</td></tr>" +
                                         "<tr title=\"This is the form from the legend on the GAJ map that this location\'s response was classified under. If there is a form in [] brackets here, that form represents a narrower transcription than the form outside of the brackets.\"><td class=\"inspector_map_cell\">Form</td><td class=\"inspector_map_cell ipastring\">" + formCode + ": " + form + "</td></tr>" +
                                         "<tr title=\"This is form of the informant\'s response recorded for this location for this map.\"><td class=\"inspector_map_cell\">Response</td><td class=\"inspector_map_cell ipastring\">" + rsp + "</td></tr>";
                    if (noteCode) {
                        tempHTML += "<tr><td class=\"inspector_map_cell\" rowspan=\"" + noteCode.length + "\" title=\"These are notes about the informant\'s response that were recorded as single character codes.\">Note Codes</td><td class=\"inspector_map_cell jpntext\" >" + convertedNoteCodes[0] + "</td></tr>";
                        for (var noteCodeI = 1; noteCodeI < convertedNoteCodes.length; noteCodeI++) {
                            tempHTML += "<tr><td class=\"inspector_map_cell jpntext\">" + convertedNoteCodes[noteCodeI] + "</td></tr>";
                        }
                    }
                    if (note) {
                        tempHTML += "<tr title=\"This is a written note about the informant\'s response.\"><td class=\"inspector_map_cell\">Written Note</td><td class=\"inspector_map_cell jpntext\">" + note + "</td></tr>";
                    }
                    tempHTML += "</table>";
                    divElement.innerHTML += tempHTML;
                }
                outerDivElement.appendChild(divElement);
            }
        }
        
        locationInfoWindowContent.appendChild(outerDivElement);
        locationInfoWindow = new google.maps.InfoWindow({
            content: locationInfoWindowContent,
            maxWidth: 400,
            position: new google.maps.LatLng(gajdViewer.getCenterLat(locationNo), gajdViewer.getCenterLng(locationNo))
        });
        locationInfoWindow.open(gajdViewer._map);
    });
}

// This takes a GAJ note code as a parameter and returns an array of strings with the text corresponding to the each code character.
gajdViewer.convertNoteCodesToText = function (noteCode) {
    var expandedText = [];
    if (noteCode) {
        for (var charI = 0; charI < noteCode.length; charI++) {
            var tempChar = noteCode.charAt(charI);
            // Code for adding Japanese translations of the note code.
            switch (tempChar) {
                case 'R': expandedText.push('R: 老人が使うことば。'); break;
                case 'W': expandedText.push('W: おもに若い人が使うことば。'); break;
                case 'O': expandedText.push('O: 古いことば。'); break;
                case 'N': expandedText.push('N: 新しいことば。'); break;
                case 'C': expandedText.push('C: 使用が多いことば，一般的である，普段のことば。'); break;
                case 'M': expandedText.push('M: 使用が少ないことば。'); break;
                case 'B': expandedText.push('B: おもに男性が使う。'); break;
                case 'G': expandedText.push('G: おもに女性が使う。'); break;
                case 'I': expandedText.push('I: おもに子供が使う。'); break;
                case 'K': expandedText.push('K: 敬意のあることば。'); break;
                case 'A': expandedText.push('A: 改まったことば，上品なことば。丁寧なことば。'); break;
                case 'E': expandedText.push('E: 下品なことば。卑語。'); break;
                case 'Z': expandedText.push('Z: ぞんざいな言い方，俗なことば，くだけたことば。'); break;
                case 'D': expandedText.push('D: 方言的な言い方，ここの土地のことば。'); break;
                case 'S': expandedText.push('S: 共通語，標準語的なことば。'); break;
                case '?': expandedText.push('?: 回答に疑問がある，誤答かもしれない，自信のない回答。'); break;
                case '#': expandedText.push('#: 長く考えてから答えた。'); break;
                case '!': expandedText.push('!: 笑いながら，感嘆の意をこめて。'); break;
                case 'Y': expandedText.push('Y: 誘導による回答。'); break;
                case ']': expandedText.push(']: 参考話者の回答。'); break;
                case 'V': expandedText.push('V: 自然談話で得られたことば。'); break;
                case 'H': expandedText.push('H: 文章による注記を参照'); break;
                default:
                    break;
            }
            
            // Code for adding English translations of the note code.
            //switch (noteCode.charAt(charI)) {
                //case 'R': expandedText.push('R: Expression used by elderly people.'); break;
                //case 'W': expandedText.push('W: Expression used primarily by young people.'); break;
                //case 'O': expandedText.push('O: Old expression.'); break;
                //case 'N': expandedText.push('N: New expression.'); break;
                //case 'C': expandedText.push('C: Frequently-used expression. Ordinary expression.'); break;
                //case 'M': expandedText.push('M: Infrequently-used expression.'); break;
                //case 'B': expandedText.push('B: Primarily used by men.'); break;
                //case 'G': expandedText.push('G: Primarily used by women.'); break;
                //case 'I': expandedText.push('I: Primarily used by children.'); break;
                //case 'K': expandedText.push('K: Respectful/honorific expression.'); break;
                //case 'A': expandedText.push('A: Formal/elegant/polite expression.'); break;
                //case 'E': expandedText.push('E: Crude/vulgar expression.'); break;
                //case 'Z': expandedText.push('Z: Rough/slang/casual expression.'); break;
                //case 'D': expandedText.push('D: Dialect expression. Expression belonging to this place.'); break;
                //case 'S': expandedText.push('S: Standard Japanese(-esque) expression.'); break;
                //case '?': expandedText.push('?: Response is questionable. Response may be mistaken. Informant not confident with response.'); break;
                //case '#': expandedText.push('#: Informant responded after thinking for a long while.'); break;
                //case '!': expandedText.push('!: While laughing; with admiration/exclamation.'); break;
                //case 'Y': expandedText.push('Y: Guided response.'); break;
                //case ']': expandedText.push(']: Response from consulting speaker (ie. not the primary informant).'); break;
                //case 'V': expandedText.push('V: Expression obtained through natural conversation.'); break;
                //case 'H': expandedText.push('H: See written note.'); break;
            //    default:
            //        break;
            //}
        }
    }
    
    return expandedText;
}

//converts a raw response string to IPA
gajdViewer.convertResponseToIPA = function (response) {
    // these must come first otherwise it will obliterate any HTML entity codes containing a 2 or 8
    response = response.replace(/8/g,'&#7488;');
    response = response.replace(/2/g,'&#747;');
    //replace all 4-character, then 3-character, then 2-character, then 1-character codes
    response = response.replace(/0U@-/g,'&#7514;&#776;');
    response = response.replace(/U@-ﾟ/g,'&#623;&#776;&#805;');
    response = response.replace(/U@-｡/g,'&#623;&#776;&#805;');
    response = response.replace(/U@-\^/g,'&#623;&#776;&#771;');
    response = response.replace(/U@-~/g,'&#623;&#776;&#771;');
    response = response.replace(/A@\//g,'æ&#774;');
    response = response.replace(/0A@/g,'&#61857;');
    response = response.replace(/A@7/g,'æ&#797;');
    response = response.replace(/A@\^/g,'æ&#771;');
    response = response.replace(/A@~/g,'æ&#771;');
    response = response.replace(/0H\\/g,'&#7580;&#807;');
    response = response.replace(/0S@/g,'&#7581;');
    response = response.replace(/E,\//g,'&#277;&#797;');
    response = response.replace(/0E,/g,'&#7497;&#797;');
    response = response.replace(/E\*\//g,'&#603;&#774;');
    response = response.replace(/0E\*/g,'&#7499;');
    response = response.replace(/E\*8/g,'&#603;&#798;');
    response = response.replace(/E\*\^/g,'&#603;&#771;');
    response = response.replace(/E\*~/g,'&#603;&#771;');
    response = response.replace(/E#\//g,'&#1241;&#774;');
    response = response.replace(/0E#/g,'&#7498;');
    response = response.replace(/E#~/g,'&#601;&#771;');
    response = response.replace(/0F\\/g,'&#7602;');
    response = response.replace(/F\\\^/g,'&#632;&#771;');
    response = response.replace(/F\\~/g,'&#632;&#771;');
    response = response.replace(/G#\^/g,'&#611;&#771;');
    response = response.replace(/G#~/g,'&#611;&#771;');
    response = response.replace(/0I-/g,'&#8305;&#776;');
    response = response.replace(/I-ﾟ/g,'ï&#805;');
    response = response.replace(/I-｡/g,'ï&#805;');
    response = response.replace(/I-\^/g,'ï&#771;');
    response = response.replace(/I-~/g,'ï&#771;');
    response = response.replace(/I\*\//g,'&#617;&#774;');
    response = response.replace(/I\*\^/g,'&#617;&#771;');
    response = response.replace(/I\*~/g,'&#617;&#771;');
    response = response.replace(/K1W/g,'k&#811;');
    response = response.replace(/N@-/g,'&#626;&#809;');
    response = response.replace(/N@\^/g,'&#626;&#771;');
    response = response.replace(/N@~/g,'&#626;&#771;');
    response = response.replace(/N\*_/g,'&#331;&#809;');
    response = response.replace(/N\*\//g,'&#331;&#774;');
    response = response.replace(/0N\*/g,'&#7505;');
    response = response.replace(/N\*\^/g,'&#331;&#771;');
    response = response.replace(/N\*~/g,'&#331;&#771;');
    response = response.replace(/0N9/g,'&#7482;');
    response = response.replace(/N9\^/g,'&#628;&#771;');
    response = response.replace(/N9~/g,'&#628;&#771;');
    response = response.replace(/O@\//g,'ø&#774;');
    response = response.replace(/0R\\/g,'&#x02B3;');
    response = response.replace(/0S\\/g,'&#7604;');
    response = response.replace(/S\\</g,'&#643;&#812;');
    response = response.replace(/S\\\^/g,'&#643;&#771;');
    response = response.replace(/S\\~/g,'&#643;&#771;');
    response = response.replace(/0U@/g,'&#7514;');
    response = response.replace(/U@ﾟ/g,'&#623;&#805;');
    response = response.replace(/U@｡/g,'&#623;&#805;');
    response = response.replace(/U@-/g,'&#623;&#776;');
    response = response.replace(/U@\^/g,'&#623;&#771;');
    response = response.replace(/U@~/g,'&#623;&#771;');
    response = response.replace(/U\*ﾟ/g,'&#631;&#805;');
    response = response.replace(/0K#/g,'&#739;');
    response = response.replace(/0Z\\/g,'&#7614;');
    response = response.replace(/Z\\ﾟ/g,'&#658;&#805;');
    response = response.replace(/Z\\｡/g,'&#658;&#805;');
    response = response.replace(/Z\\\^/g,'&#658;&#771;');
    response = response.replace(/Z\\~/g,'&#658;&#771;');
    response = response.replace(/0Z@/g,'&#7613;');
    response = response.replace(/3ｹﾞ/g,'<sup>げ</sup>');
    response = response.replace(/3ﾃﾞ/g,'<sup>で</sup>');
    response = response.replace(/0A/g,'&#7491;');
    response = response.replace(/Aﾟ/g,'&#7681;');
    response = response.replace(/A｡/g,'&#7681;');
    response = response.replace(/A\^/g,'ã');
    response = response.replace(/A~/g,'ã');
    response = response.replace(/A2/g,'a&#747;');
    response = response.replace(/A@/g,'æ');
    response = response.replace(/A\*/g,'&#592;');
    response = response.replace(/0B/g,'&#7495;');
    response = response.replace(/Bﾟ/g,'b&#805;');
    response = response.replace(/B｡/g,'b&#805;');
    response = response.replace(/H\\/g,'ç');
    response = response.replace(/S@/g,'&#597;');
    response = response.replace(/D_/g,'d&#809;');
    response = response.replace(/0D/g,'&#7496;');
    response = response.replace(/Dﾟ/g,'d&#805;');
    response = response.replace(/D｡/g,'d&#805;');
    response = response.replace(/D\^/g,'d&#771;');
    response = response.replace(/D~/g,'d&#771;');
    response = response.replace(/D\*/g,'&#599;');
    response = response.replace(/D>/g,'&#7553;');
    response = response.replace(/D#/g,'ð');
    response = response.replace(/E\//g,'&#277;');
    response = response.replace(/0E/g,'&#7497;');
    response = response.replace(/Eﾟ/g,'e&#805;');
    response = response.replace(/E｡/g,'e&#805;');
    response = response.replace(/E,/g,'e&#797;');
    response = response.replace(/E7/g,'e&#797;');
    response = response.replace(/E\./g,'e&#797;');
    response = response.replace(/E8/g,'e&#798;');
    response = response.replace(/E-/g,'ë');
    response = response.replace(/E\+/g,'e&#799;');
    response = response.replace(/E\^/g,'&#7869;');
    response = response.replace(/E~/g,'&#7869;');
    response = response.replace(/E\*/g,'&#603;');
    response = response.replace(/E#/g,'&#601;');
    response = response.replace(/F\\/g,'&#632;');
    response = response.replace(/0G/g,'&#7501;');
    response = response.replace(/Gﾟ/g,'g&#805;');
    response = response.replace(/G｡/g,'g&#805;');
    response = response.replace(/G\^/g,'g&#771;');
    response = response.replace(/G~/g,'g&#771;');
    response = response.replace(/G#/g,'&#611;');
    response = response.replace(/0H/g,'&#688;');
    response = response.replace(/H</g,'&#614;');
    response = response.replace(/I\//g,'&#301;');
    response = response.replace(/0I/g,'&#8305;');
    response = response.replace(/Iﾟ/g,'i&#805;');
    response = response.replace(/I｡/g,'i&#805;');
    response = response.replace(/I8/g,'i&#798;');
    response = response.replace(/I-/g,'ï');
    response = response.replace(/I\^/g,'&#297;');
    response = response.replace(/I~/g,'&#297;');
    response = response.replace(/I\*/g,'&#617;');
    response = response.replace(/0J/g,'&#690;');
    response = response.replace(/J\^/g,'j&#771;');
    response = response.replace(/J~/g,'j&#771;');
    response = response.replace(/0K/g,'&#7503;');
    response = response.replace(/K</g,'k&#812;');
    response = response.replace(/K>/g,'&#7556;');
    response = response.replace(/L%/g,'&#621;');
    response = response.replace(/M_/g,'m&#809;');
    response = response.replace(/0M/g,'&#7504;');
    response = response.replace(/Mﾟ/g,'m&#805;');
    response = response.replace(/M｡/g,'m&#805;');
    response = response.replace(/M>/g,'&#7558;');
    response = response.replace(/M@/g,',m');
    response = response.replace(/N_/g,'&#7751;');
    response = response.replace(/0N/g,'&#8319;');
    response = response.replace(/Nﾟ/g,'n&#805;');
    response = response.replace(/N｡/g,'n&#805;');
    response = response.replace(/N\^/g,'ñ');
    response = response.replace(/N~/g,'ñ');
    response = response.replace(/N>/g,'&#7559;');
    response = response.replace(/N@/g,'&#626;');
    response = response.replace(/N\*/g,'&#331;');
    response = response.replace(/N9/g,'&#628;');
    response = response.replace(/0~/g,'&#732;');
    response = response.replace(/O\//g,'&#335;');
    response = response.replace(/0O/g,'&#7506;');
    response = response.replace(/Oﾟ/g,'o&#805;');
    response = response.replace(/O｡/g,'o&#805;');
    response = response.replace(/O,/g,'o&#797;');
    response = response.replace(/O7/g,'o&#797;');
    response = response.replace(/O\./g,'o&#797;');
    response = response.replace(/O\^/g,'õ');
    response = response.replace(/O~/g,'õ');
    response = response.replace(/O\*/g,'&#596;');
    response = response.replace(/O@/g,'ø');
    response = response.replace(/O-/g,'&#156;');
    response = response.replace(/0P/g,'&#7510;');
    response = response.replace(/P</g,'p&#812;');
    response = response.replace(/0R/g,'&#691;');
    response = response.replace(/R\\/g,'&#638;');
    response = response.replace(/R>/g,'&#7561;');
    response = response.replace(/R%/g,'&#637;');
    response = response.replace(/0S/g,'&#738;');
    response = response.replace(/S</g,'s&#812;');
    response = response.replace(/S\^/g,'s&#771;');
    response = response.replace(/S~/g,'s&#771;');
    response = response.replace(/S>/g,'&#7562;');
    response = response.replace(/S\\/g,'&#643;');
    response = response.replace(/0T/g,'&#7511;');
    response = response.replace(/T</g,'t&#812;');
    response = response.replace(/Tﾟ/g,'t&#805;');
    response = response.replace(/T｡/g,'t&#805;');
    response = response.replace(/T>/g,'&#427;');
    response = response.replace(/T%/g,'&#648;');
    response = response.replace(/T#/g,'&#952;');
    response = response.replace(/4T/g,'&#7451;');
    response = response.replace(/U\//g,'&#365;');
    response = response.replace(/0U/g,'&#7512;');
    response = response.replace(/Uﾟ/g,'u&#805;');
    response = response.replace(/U｡/g,'u&#805;');
    response = response.replace(/U-/g,'ü');
    response = response.replace(/U\^/g,'&#361;');
    response = response.replace(/U~/g,'&#361;');
    response = response.replace(/U@/g,'&#623;');
    response = response.replace(/U\*/g,'&#631;');
    response = response.replace(/Vﾟ/g,'v&#805;');
    response = response.replace(/V｡/g,'v&#805;');
    response = response.replace(/0W/g,'&#695;');
    response = response.replace(/W\^/g,'w&#771;');
    response = response.replace(/W~/g,'w&#771;');
    response = response.replace(/K#/g,'x');
    response = response.replace(/Y\//g,'y&#774;');
    response = response.replace(/Y\^/g,'y&#771;');
    response = response.replace(/Y~/g,'y&#771;');
    response = response.replace(/0Z/g,'&#7611;');
    response = response.replace(/Zﾟ/g,'z&#805;');
    response = response.replace(/Z｡/g,'z&#805;');
    response = response.replace(/Z\^/g,'z&#771;');
    response = response.replace(/Z~/g,'z&#771;');
    response = response.replace(/Z>/g,'&#7566;');
    response = response.replace(/Z\\/g,'&#658;');
    response = response.replace(/Z@/g,'&#657;');
    response = response.replace(/0:/g,'&#721;');
    response = response.replace(/:\^/g,'&#720;&#771;');
    response = response.replace(/:~/g,'&#720;&#771;');
    response = response.replace(/0\?/g,'&#704;');
    response = response.replace(/\?\+/g,'&#8599;');
    response = response.replace(/\?-/g,'&#8600;');
    response = response.replace(/ｴ,/g,'&#65396;&#803;');
    response = response.replace(/ｴ7/g,'&#65396;&#803;');
    response = response.replace(/ｴ\./g,'&#65396;&#803;');
    response = response.replace(/ｷ｡/g,'&#65399;&#805;');
    response = response.replace(/ｸ｡/g,'&#65400;&#805;');
    response = response.replace(/ｼﾟ/g,'&#65404;&#805;');
    response = response.replace(/ｼ｡/g,'&#65404;&#805;');
    response = response.replace(/ｾ,/g,'&#65406;&#775;');
    response = response.replace(/ｾ7/g,'&#65406;&#775;');
    response = response.replace(/ｾ\./g,'&#65406;&#775;');
    response = response.replace(/ｾ>/g,'&#65406;&#775;');
    response = response.replace(/ﾋ｡/g,'&#65419;&#805;');
    response = response.replace(/0ﾜ/g,'<sup>わ</sup>');
    response = response.replace(/0ﾝ/g,'<sup>ん</sup>');
    response = response.replace(/0ｰ/g,'<sup>ー</sup>');
    response = response.replace(/3ｾ/g,'<sup>せ</sup>');
    response = response.replace(/A/g,'a');
    response = response.replace(/B/g,'b');
    response = response.replace(/C/g,'c');
    response = response.replace(/D/g,'d');
    response = response.replace(/E/g,'e');
    response = response.replace(/F/g,'f');
    response = response.replace(/G/g,'g');
    response = response.replace(/H/g,'h');
    response = response.replace(/I/g,'i');
    response = response.replace(/J/g,'j');
    response = response.replace(/K/g,'k');
    response = response.replace(/L/g,'l');
    response = response.replace(/M/g,'m');
    response = response.replace(/N/g,'n');
    response = response.replace(/O/g,'o');
    response = response.replace(/P/g,'p');
    response = response.replace(/Q/g,'Q');
    response = response.replace(/R/g,'r');
    response = response.replace(/S/g,'s');
    response = response.replace(/T/g,'t');
    response = response.replace(/U/g,'u');
    response = response.replace(/V/g,'v');
    response = response.replace(/W/g,'w');
    response = response.replace(/Y/g,'y');
    response = response.replace(/Z/g,'z');
    response = response.replace(/:/g,'&#720;');
    response = response.replace(/\?/g,'&#660;');
    response = response.replace(/'/g,'&#700;');
    response = response.replace(/"/g,'&#699;');
    response = response.replace(/\!/g,'&#865;');
    return response;
}


gajdViewer.exportCSV = function () {
    var exportTextarea = document.getElementById('exportTextarea');
    var exportSelectMenu = document.getElementById('exportSelect');
    if (exportSelectMenu.selectedIndex != -1) {
        var dataSetNo = parseInt(exportSelectMenu.options[exportSelectMenu.selectedIndex].value);
        var csvText = 'locNo,lng,lat,numOfEntriesForLocationInDataSet,mapNo,gajHwNo(:prnNo),gajHwForm([prnForm]),responseText,noteCode,note';
        
        // loop through all the locations in this dataSet. One line for each data set
        for (var locNo in gajdViewer.dataSets[dataSetNo]) {
            csvText += '\n' + locNo + ',' + gajdViewer.getCenterLng(locNo) + ',' + gajdViewer.getCenterLat(locNo) + ',' + gajdViewer.dataSets[dataSetNo][locNo].length;
            for (var mapI = 0; mapI < gajdViewer.dataSets[dataSetNo][locNo].length; mapI++) {
                var mapNo = gajdViewer.dataSets[dataSetNo][locNo][mapI].mapNo;
                var hwNo = gajdViewer.dataSets[dataSetNo][locNo][mapI].hwNo;
                var prnNo = gajdViewer.dataSets[dataSetNo][locNo][mapI].prnNo;
                var noteCode = gajdViewer.dataSets[dataSetNo][locNo][mapI].noteCode;
                var note = gajdViewer.dataSets[dataSetNo][locNo][mapI].note;
                var rsp = gajdViewer.convertResponseToIPA(gajdViewer.dataSets[dataSetNo][locNo][mapI].rsp);
                var hwForm = gajdViewer.mapData[mapNo].hws[hwNo].hwForm;
                var prnForm = (prnNo ? gajdViewer.mapData[mapNo].hws[hwNo].prns[prnNo].prn : null);

                csvText += ',' + mapNo;
                csvText += ',' + hwNo + (prnNo ? ':' + prnNo : '')  +
                           ',' + hwForm.replace(/,/g, '') + (prnForm ? '[' + prnForm.replace(/,/g, '') + ']': '') +
                           ',' + rsp.replace(/,/g, '') + 
                           ',' + (noteCode ? noteCode : '') +
                           ',' + (note ? note.replace(/,/g, '') : '');
            }
        }
        
        exportTextarea.innerHTML = csvText;
    }
}

gajdViewer.saveStateToCode = function (textBoxId) {
    var saveStateTextBox = document.getElementById(textBoxId);
    saveStateTextBox.value = gajdViewer.convertConditionsToJSON();
}

//This function returns JSON string of an array of arrays based off of gajdViewer.conditionsForDataSets
//The purpose of this function (as opposed to just calling JSON.stringify(gajdViewer.conditionsForDataSets))
//is to shorten the code used for saving a map view (especially when storing the state as a URL query string).
gajdViewer.convertConditionsToJSON = function () {
    var resultArray = [];
    for (var dataSetI = 0; dataSetI < gajdViewer.conditionsForDataSets.length; dataSetI++) {
        resultArray.push([]); //create an array to hold all the info for the current data set
        resultArray[dataSetI].push(gajdViewer.conditionsForDataSets[dataSetI].label);
        resultArray[dataSetI].push(gajdViewer.conditionsForDataSets[dataSetI].color);
        resultArray[dataSetI].push([]); //add an array to hold all of the condition sets for this data set
        for (var conditionSetI = 0; conditionSetI < gajdViewer.conditionsForDataSets[dataSetI].conditionSets.length; conditionSetI++) {
            resultArray[dataSetI][2].push([]); //add an array to hold all of the conditions for this condition set
            for (var conditionI = 0; conditionI < gajdViewer.conditionsForDataSets[dataSetI].conditionSets[conditionSetI].length; conditionI++) {
                resultArray[dataSetI][2][conditionSetI].push([]); //add an array to hold all of the info for this condition
                resultArray[dataSetI][2][conditionSetI][conditionI].push(gajdViewer.conditionsForDataSets[dataSetI].conditionSets[conditionSetI][conditionI].mapNo);
                resultArray[dataSetI][2][conditionSetI][conditionI].push([]); //add an array to hold all of the forms for this condition
                for (var formI = 0; formI < gajdViewer.conditionsForDataSets[dataSetI].conditionSets[conditionSetI][conditionI].forms.length; formI++) {
                    resultArray[dataSetI][2][conditionSetI][conditionI][1].push([]);//create an array to hold the hwNo or hwNo and prnNo;
                    resultArray[dataSetI][2][conditionSetI][conditionI][1][formI].push(gajdViewer.conditionsForDataSets[dataSetI].conditionSets[conditionSetI][conditionI].forms[formI].hwNo);
                    if (gajdViewer.conditionsForDataSets[dataSetI].conditionSets[conditionSetI][conditionI].forms[formI].prnNo != null) {
                        resultArray[dataSetI][2][conditionSetI][conditionI][1][formI].push(gajdViewer.conditionsForDataSets[dataSetI].conditionSets[conditionSetI][conditionI].forms[formI].prnNo);
                    }
                }
            }
        }
    }
    return JSON.stringify(resultArray);

    
    //[
    //    {"dataSetNo":0,"label":"test","color":"#FF0000","conditionSets":
    //        [[{"mapNo":3,"forms":
    //            [{"hwNo":"1","prnNo":"1"},
    //             {"hwNo":"1","prnNo":"2"},
    //             {"hwNo":"2","prnNo":"1"}
    //            ]
    //        }]]
    //    },
    //    {"dataSetNo":1,"label":"Test 2","color":"#00FF00","conditionSets":[[{"mapNo":12,"forms":[{"hwNo":"1"},{"hwNo":"2"}]}]]},
    //    {"dataSetNo":2,"label":"wo","color":"#0000FF","conditionSets":[[{"mapNo":6,"forms":[{"hwNo":"3"}]}]]}
    //]
    //[
    //    ["test","#FF0000",
    //        [[[3,
    //            [["1","1"],["1","2"],["2","1"]]]]]],
    //    ["Test 2","#00FF00",[[[12,[["1"],["2"]]]]]],
    //    ["wo","#0000FF",[[[6,[["3"]]]]]]
    //]
    
}

//this takes the state encoded in jsonCodedState (presumably generated by gajdViewer.convertConditionsToJSON())
//and converts it to an array of condition sets and stores it in gajdViewer.conditionsForDataSets.
gajdViewer.convertJSONToConditions = function (jsonCodedState) {
    var shortArray = jQuery.parseJSON(jsonCodedState);
    gajdViewer.conditionsForDataSets = [];
    for (var dataSetI = 0; dataSetI < shortArray.length; dataSetI++) {
        gajdViewer.conditionsForDataSets.push([]); //create an array to hold all the info for the current data set
        gajdViewer.conditionsForDataSets[dataSetI].dataSetNo = dataSetI;
        gajdViewer.conditionsForDataSets[dataSetI].label = shortArray[dataSetI][0];
        gajdViewer.conditionsForDataSets[dataSetI].color = shortArray[dataSetI][1];
        gajdViewer.conditionsForDataSets[dataSetI].conditionSets = []; //add an array to hold all of the condition sets for this data set
        for (var conditionSetI = 0; conditionSetI < shortArray[dataSetI][2].length; conditionSetI++) {
            gajdViewer.conditionsForDataSets[dataSetI].conditionSets.push([]); //add an array to hold all of the conditions for this condition set
            for (var conditionI = 0; conditionI < shortArray[dataSetI][2][conditionSetI].length; conditionI++) {
                gajdViewer.conditionsForDataSets[dataSetI].conditionSets[conditionSetI].push({}); //add an object to hold all of the info for this condition
                gajdViewer.conditionsForDataSets[dataSetI].conditionSets[conditionSetI][conditionI].mapNo = shortArray[dataSetI][2][conditionSetI][conditionI][0];
                gajdViewer.conditionsForDataSets[dataSetI].conditionSets[conditionSetI][conditionI].forms = []; //add an array to hold all of the forms for this condition
                for (var formI = 0; formI < shortArray[dataSetI][2][conditionSetI][conditionI][1].length; formI++) {
                    gajdViewer.conditionsForDataSets[dataSetI].conditionSets[conditionSetI][conditionI].forms.push({}); //create an object to hold the information for this form
                    gajdViewer.conditionsForDataSets[dataSetI].conditionSets[conditionSetI][conditionI].forms[formI].hwNo = shortArray[dataSetI][2][conditionSetI][conditionI][1][formI][0]
                    if (shortArray[dataSetI][2][conditionSetI][conditionI][1][formI].length == 2) {
                        gajdViewer.conditionsForDataSets[dataSetI].conditionSets[conditionSetI][conditionI].forms[formI].prnNo = shortArray[dataSetI][2][conditionSetI][conditionI][1][formI][1];
                    }
                }
            }
        }
    }
    
}

gajdViewer.generatePermalink = function () {
    var dataConditions = encodeURIComponent(gajdViewer.convertConditionsToJSON());
    //encode characters not covered by encodeURIComponent:  - _ . ! ~ * ' ( )
    //dataConditions = dataConditions.replace(/\-/g, "%2D");
    //dataConditions = dataConditions.replace(/\_/g, "%5F");
    //dataConditions = dataConditions.replace(/\./g, "%2E");
    //dataConditions = dataConditions.replace(/\!/g, "%21");
    //dataConditions = dataConditions.replace(/\~/g, "%7E");
    //dataConditions = dataConditions.replace(/\*/g, "%2A");
    //dataConditions = dataConditions.replace(/\'/g, "%27");
    //dataConditions = dataConditions.replace(/\(/g, "%28");
    //dataConditions = dataConditions.replace(/\)/g, "%29");
    
    // get the current map view
    var mapCenter = gajdViewer._map.getCenter();
    var mapZoom = gajdViewer._map.getZoom();
    
    var queryString = "?conditions=" + dataConditions + "&ctr=" + mapCenter.toUrlValue() + "&zm=" + mapZoom;
    var permalink = document.URL.split('?')[0] + queryString;

    if (permalink.length > 2000) {
        window.alert('The permalink generated was too long (more than 2000 characters) and probably will fail. Please save your map view to a code instead.');
    } else {
        document.location = permalink;
    }
}

gajdViewer.recreateStateFromCode = function (textBoxId) {
    gajdViewer.recreateStateFromJSON(document.getElementById(textBoxId).value);
}

gajdViewer.recreateStateFromJSON = function (jsonCodedState) {
    var arrayOfMapNosToLoad = [];
    // first, clear the legend and map if there is anything there
    gajdViewer.reset();
    
    gajdViewer.convertJSONToConditions(jsonCodedState);
    
        
    // second, construct an array of all the numbers of the maps that need to be loaded
    // loop through all the data sets (legend entries)
    gajdViewer.conditionsForDataSets.forEach(function (dataSetConditions, dataSetNo, arrayOfConditionsForDataSets) {
        // loop through all the sets of condition for a legend entry
        dataSetConditions.conditionSets.forEach(function (conditionSet, conditionSetNo, arrayOfConditionSets){
            // loop through
            conditionSet.forEach(function (condition, conditionNo, arrayOfConditions){
                if (arrayOfMapNosToLoad.indexOf(condition.mapNo) == -1) {
                    arrayOfMapNosToLoad.push(condition.mapNo);
                }
            });
        });
    });
    
    //load all the maps, then get all the locations for each set and map them    
    gajdViewer.getSeveralMaps(arrayOfMapNosToLoad, function () {
        for (dataSetI = 0; dataSetI < gajdViewer.conditionsForDataSets.length; dataSetI++) {
            gajdViewer.addOptionToAddToExistingSet(dataSetI, gajdViewer.conditionsForDataSets[dataSetI].label);
            gajdViewer.addOptionToExportSet(dataSetI, gajdViewer.conditionsForDataSets[dataSetI].label);
            gajdViewer.getLocationsForDataSet(dataSetI);
            gajdViewer.mapLocationSet(dataSetI);
            gajdViewer.addLegendEntry(dataSetI);
        }
    });
    
    
    // Scroll the window to the top of the page
    window.scroll(0, 0);
}

gajdViewer.reset = function () {
    while (gajdViewer.dataSets.length > 0) {
        gajdViewer.removeDataSet(0);
    }
}

gajdViewer.removeDataSet = function (dataSetNo) {
    //remove Legend Entry from legend box
    //first, remove the entry
    var legendBox = document.getElementById('legend_box');
    legendBox.removeChild(document.getElementById('legend_row' + dataSetNo));
    
    //then adjust the ids of all remaining entries
    var updateLegendRow = function (oldDataSetNo, newDataSetNo) {
        var legendRowPElement = document.getElementById('legend_row' + oldDataSetNo);
        legendRowPElement.id   = 'legend_row' + (newDataSetNo);
        
        var colorBlockSpan = document.getElementById('color_block' + oldDataSetNo);
        colorBlockSpan.id  = 'color_block' + (newDataSetNo);
        colorBlockSpan.onclick = function () {gajdViewer.enableColorChangeForm(newDataSetNo, gajdViewer.conditionsForDataSets[newDataSetNo].color);};
        
        var labelSpan = document.getElementById('label' + oldDataSetNo);
        labelSpan.id = 'label' + (newDataSetNo);
        labelSpan.onclick = function () {gajdViewer.enableLabelChangeForm(newDataSetNo, gajdViewer.conditionsForDataSets[newDataSetNo].label)};
        
        var deleteSetElement = document.getElementById('delete_set' + oldDataSetNo);
        deleteSetElement.id   = 'delete_set' + (newDataSetNo);
        deleteSetElement.onclick = function () {gajdViewer.deleteSetConfirm(newDataSetNo, gajdViewer.conditionsForDataSets[newDataSetNo].label);};
    }
    for (var legendRowI = dataSetNo + 1; legendRowI < gajdViewer.dataSets.length; legendRowI++) {
        updateLegendRow(legendRowI, legendRowI - 1);
    }
    
    //also, remove the entry from the drop-down menus for adding more locations under an existing legend entry and for exporting data
    var legendDropDownSelect = document.getElementById('existingLegendLabel');
    legendDropDownSelect.removeChild(document.getElementById('existingLegendLabelOption' + dataSetNo));
    var exportSetSelect = document.getElementById('exportSelect');
    exportSetSelect.removeChild(document.getElementById("exportOption" + dataSetNo));
    
    //adjust the rest of the options in the drop down menus
    var legendOption;
    for (var legendOptionI = dataSetNo + 1; legendOptionI < gajdViewer.dataSets.length; legendOptionI++) {
        // first the menu for adding more locations to an existing set
        legendOption = document.getElementById('existingLegendLabelOption' + legendOptionI);
        legendOption.id = 'existingLegendLabelOption' + (legendOptionI - 1);
        legendOption.textContent = legendOptionI + legendOption.textContent.substring(legendOption.textContent.indexOf(":"));
        //then the menu for exporting data
        legendOption = document.getElementById('exportOption' + legendOptionI);
        legendOption.id = 'exportOption' +  (legendOptionI - 1);
        legendOption.textContent = legendOptionI + legendOption.textContent.substring(legendOption.textContent.indexOf(":"));
    }
    
    
    //remove conditions from memory
    gajdViewer.conditionsForDataSets.splice(dataSetNo, 1);
    //Shift all the dataSetNos for remaining data sets
    for (var conditionsI = dataSetNo; conditionsI < gajdViewer.conditionsForDataSets.length; conditionsI++) {
        gajdViewer.conditionsForDataSets[conditionsI].dataSetNo--; 
    }
    
    //remove locations from map and location data from memory
    var arrayOfOverlays = gajdViewer.overlaysForDataSets.splice(dataSetNo, 1)[0];
    var overlayI;
    for (overlayI = 0; overlayI < arrayOfOverlays.length; overlayI++) {
        arrayOfOverlays[overlayI].setMap(null); //remove rectangle from map
        arrayOfOverlays[overlayI] = null; //delete rectangle from memory
    }
    gajdViewer.dataSets.splice(dataSetNo, 1); //eliminate the locations in this data set from memory
    
    //if there are no more datasets, then disable the menus and buttons for adding to existing datasets and exporting data
    if (gajdViewer.dataSets.length == 0) {
        var addToExistingSetButton = document.getElementById("addToExistingSet");
        var exportButton = document.getElementById("exportButton");
        legendDropDownSelect.disabled = true;
        exportSetSelect.disabled = true;
        addToExistingSetButton.disabled = true;
        exportButton.disabled = true;
    }
}

gajdViewer.getSeveralMaps = function (arrayOfMapNos, postLoadCallback) {
    var mapNoI;
    
    for (mapNoI = 0; mapNoI < arrayOfMapNos.length; mapNoI++) {
        gajdViewer.getMap(arrayOfMapNos[mapNoI], function () {
                gajdViewer.confirmMapsLoaded(arrayOfMapNos, postLoadCallback);
            });
    }
}

gajdViewer.confirmMapsLoaded = function (arrayOfMapNos, postLoadCallback) {
    var mapNoI;
    var mapsLoaded = true;
    
    for (mapNoI = 0; mapNoI < arrayOfMapNos.length && mapsLoaded; mapNoI++) {
        mapsLoaded = mapsLoaded && (gajdViewer.mapData[arrayOfMapNos[mapNoI]] != null);
    }
    
    if (postLoadCallback instanceof Function && mapsLoaded) {
        postLoadCallback();
    }
}

// This returns an object holding all the data for the map whose number matches the mapNo argument.
// postLoadCallback is executed once the script is loaded.
// Note that any time we want to execute some specific code after the data for a map is loaded, we must use
// a callback due to the lack (or deprecated status / inconsistent implementation) of synchronous loading.
gajdViewer.getMap = function (mapNo, postLoadCallback) {
    if (gajdViewer.mapData[mapNo] == null)
    {
        var headElement = document.getElementsByTagName("head")[0];
        var newScriptElement = document.createElement("script");
        newScriptElement.type = "text/javascript";
        newScriptElement.src = "gajdViewerMapData/gajdDataMap" + mapNo + ".js";
        if (postLoadCallback instanceof Function) {
            newScriptElement.onload = postLoadCallback;
        }
        headElement.appendChild(newScriptElement);        
    }
    else
    {
        if (postLoadCallback instanceof Function) {
            postLoadCallback();
        }
    }
}

gajdViewer.toggleShowForms = function (mapNo) {
    var gajToggleRow = document.getElementById('gaj_guide_showhiderow_map' + mapNo)
    var gajGuideFormsRow = document.getElementById('gaj_guide_formsrow_map' + mapNo);
    var gajGuideMapTable = gajToggleRow.parentElement;
    var gajGuideJumpRow = gajGuideMapTable.lastChild;
    
    // check if the forms are already shown
    if (gajGuideFormsRow) {
        // if the forms are already being displayed, then delete the HTML element that contains them
        gajGuideMapTable.removeChild(gajGuideFormsRow);
    } else {
        // if the forms are not already being displayed, then display them
        gajdViewer.getMap(mapNo, function () {
            gajGuideFormsRow = document.createElement('tr');
            gajGuideFormsRow.id = 'gaj_guide_formsrow_map' + mapNo;
            gajGuideFormsRow.className = 'gaj_guide_formsrow_map';
            gajGuideMapTable.insertBefore(gajGuideFormsRow, gajGuideJumpRow);
            
            var gajGuideFormsCell = document.createElement('td');
            gajGuideFormsCell.className = 'gaj_guide_forms_cell';
            gajGuideFormsCell.colSpan = 3;
            gajGuideFormsRow.appendChild(gajGuideFormsCell);
            
            var gajGuideFormsTable = document.createElement('table');
            gajGuideFormsTable.className = 'gaj_guide_forms_table';
            gajGuideFormsTable.id = 'gaj_guide_forms_table' + mapNo;
            gajGuideFormsCell.appendChild(gajGuideFormsTable);
            
            var gajGuideFormsHeaderRow = document.createElement('tr');
            gajGuideFormsHeaderRow.className = 'gaj_guide_forms_header_row';
            gajGuideFormsHeaderRow.id = 'gaj_guide_forms_header_row' + mapNo;
            gajGuideFormsTable.appendChild(gajGuideFormsHeaderRow);
            
            var gajGuideFormsHeaderGAJEntryCell = document.createElement('th');
            gajGuideFormsHeaderGAJEntryCell.className = 'gaj_guide_forms_header_gaj_entry_cell';
            gajGuideFormsHeaderGAJEntryCell.innerHTML = 'GAJ Map Legend Entry';
            gajGuideFormsHeaderGAJEntryCell.colSpan = 2;
            gajGuideFormsHeaderRow.appendChild(gajGuideFormsHeaderGAJEntryCell);
            
            var gajGuideFormsHeaderGAJNarTransCell = document.createElement('th');
            gajGuideFormsHeaderGAJNarTransCell.className = 'gaj_guide_forms_header_gaj_nar_trans_cell';
            gajGuideFormsHeaderGAJNarTransCell.innerHTML = 'Narrowly Transcribed Form';
            gajGuideFormsHeaderGAJNarTransCell.colSpan = 2;
            gajGuideFormsHeaderRow.appendChild(gajGuideFormsHeaderGAJNarTransCell);
            
            var hwNo;
            var prnNo;
            
            if (gajdViewer.mapData[mapNo] != null) {
                for (hwNo in gajdViewer.mapData[mapNo].hws) {
                    var rowElement;
                    var hwNoCellElement;
                    var hwFormCellElement;
                    var prnNoElement;
                    var prnFormElement;
                    var isFirstRowForHw = true;
                    
                    rowElement = document.createElement("tr");
                    rowElement.className = 'gaj_guide_form_row';
                    gajGuideFormsTable.appendChild(rowElement);
                        
                    hwNoCellElement = document.createElement("td");
                    hwNoCellElement.innerHTML = hwNo;
                    rowElement.appendChild(hwNoCellElement);
                        
                    hwFormCellElement = document.createElement("td");
                    hwFormCellElement.innerHTML = gajdViewer.mapData[mapNo].hws[hwNo].hwForm;
                    rowElement.appendChild(hwFormCellElement);
                    
                    // if this headword lacks any "pronunciations", then just finish the first row
                    if (gajdViewer.mapData[mapNo].hws[hwNo].prns == null) {
                        rowElement.appendChild(document.createElement("td"));
                        rowElement.appendChild(document.createElement("td"));
                    } else {
                        // if there are any pronunciations associated with this headword,
                        // then add all the pronunciation information
                        hwNoCellElement.rowSpan = Object.keys(gajdViewer.mapData[mapNo].hws[hwNo].prns).length;
                        hwFormCellElement.rowSpan = Object.keys(gajdViewer.mapData[mapNo].hws[hwNo].prns).length;
                        
                        for (prnNo in gajdViewer.mapData[mapNo].hws[hwNo].prns) {
                            if (!isFirstRowForHw) {
                                rowElement = document.createElement("tr");
                                rowElement.className = 'gaj_guide_form_row';
                                gajGuideFormsTable.appendChild(rowElement);
                            } else {
                                isFirstRowForHw = false;
                            }
                            
                            prnNoElement = document.createElement("td");
                            prnNoElement.innerHTML = prnNo;
                            rowElement.appendChild(prnNoElement);
                            
                            prnFormElement = document.createElement("td");
                            prnFormElement.innerHTML = gajdViewer.mapData[mapNo].hws[hwNo].prns[prnNo].prn;
                            rowElement.appendChild(prnFormElement);
                        }
                    }
                }
            }
        });
    }
}

gajdViewer.addAccentOverlay = function () {
    var imageMapType = new google.maps.ImageMapType({
        getTileUrl: function(coord, zoom) {
            return ('http://warp.worldmap.harvard.edu/maps/tile/2660/' + zoom + '/' + coord.x + '/' + coord.y + '.png');
        },
        tileSize: new google.maps.Size(256, 256)
    });
    gajdViewer._map.overlayMapTypes.push(imageMapType);
    document.getElementById('accentMapCheckbox').onclick = function () { gajdViewer.removeAccentOverlay(); };
    var legendImageBox = document.getElementById('legend_image_box');
    legendImageBox.style.display = 'block';
    legendImageBox.innerHTML = '<a href="groundOverlayImages/uwano-legend(950x1437).png" target="_blank">' +
                                '<img src="groundOverlayImages/uwano-legend(400x605).png" alt="Legend for Uwano\'s Dialect Accent Map" /></a>';
}

gajdViewer.removeAccentOverlay = function () {
    document.getElementById('accentMapCheckbox').onclick = function () { gajdViewer.addAccentOverlay(); };

    var legendImageBox = document.getElementById('legend_image_box');
    legendImageBox.style.display = 'none';
    while (legendImageBox.hasChildNodes()) {
        legendImageBox.removeChild(legendImageBox.childNodes[0]);
    }

    return gajdViewer._map.overlayMapTypes.pop();
}

gajdViewer.changeMarkerOpacity = function () {
    var opacitySlider = document.getElementById('opacitySlider');
    gajdViewer.markerOpacity = parseFloat(opacitySlider.value);
    
    for (var dataSetI = 0; dataSetI < gajdViewer.overlaysForDataSets.length; dataSetI++) {
        for (var overlayI = 0; overlayI < gajdViewer.overlaysForDataSets[dataSetI].length; overlayI++) {
            //change opacity of individual overlay
            if (gajdViewer.overlaysForDataSets[dataSetI][overlayI]) {
                gajdViewer.overlaysForDataSets[dataSetI][overlayI].setOptions({fillOpacity: gajdViewer.markerOpacity, strokeOpacity: gajdViewer.markerOpacity});
            }
        }
    }
}

gajdViewer.generatePrintView = function () {
    var newWindow = window.open('gajdPrint.html', 'printWindow');
}

gajdViewer.initializePrintView = function () {
    gajdViewer.dataSets = window.opener.gajdViewer.dataSets;
    gajdViewer.conditionsForDataSets = window.opener.gajdViewer.conditionsForDataSets;
    var centerOfOldMap = window.opener.gajdViewer._map.getCenter();
    var centerOfMap = new google.maps.LatLng(centerOfOldMap.lat(), centerOfOldMap.lng());
    var boundsOfMap = window.opener.gajdViewer._map.getBounds();
    var zoomOfMap = window.opener.gajdViewer._map.getZoom() + 1;
    var mapTypeIdOfMap = window.opener.gajdViewer._map.getMapTypeId();
    var mapCanvasId = 'print_map_canvas';
    var legendContainerId = 'print_legend_box';
    gajdViewer.markerOpacity = window.opener.gajdViewer.markerOpacity;
    
    var mapOptions = {
        center: centerOfMap,
        zoom: zoomOfMap,
        disableDefaultUI: true,
        mapTypeId: mapTypeIdOfMap,
        maxZoom: 11,
        minZoom: 5
    };
    
    this._map = new google.maps.Map(document.getElementById(mapCanvasId), mapOptions);
    this._styles = [
        {
            featureType: "road",
            elementType: "all",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];
    this._map.setOptions({styles: this._styles});
    this._map.fitBounds(boundsOfMap);
    
    for (var overlayMapI = 0; overlayMapI < window.opener.gajdViewer._map.overlayMapTypes.length; overlayMapI++) {
        gajdViewer._map.overlayMapTypes.push(window.opener.gajdViewer._map.overlayMapTypes.getAt(overlayMapI));
    }
    
    
    //make it so that the user cannot pan away from Japan
    //code adapted from http://stackoverflow.com/questions/3125065/how-do-i-limit-panning-in-google-maps-api-v3?rq=1
    this._allowedBounds = new google.maps.LatLngBounds(new google.maps.LatLng(24, 122.5),
                                                       new google.maps.LatLng((45+(40/60)), 147.5));
    this._lastValidCenter = centerOfMap;
    google.maps.event.addListener(this._map, 'center_changed', function () {
        if (gajdViewer._allowedBounds.contains(gajdViewer._map.getCenter())) {
            gajdViewer._lastValidCenter = gajdViewer._map.getCenter();
        } else {
            gajdViewer._map.panTo(gajdViewer._lastValidCenter);
        }});
    
    for (var dataSetI = 0; dataSetI < gajdViewer.dataSets.length; dataSetI++) {
        gajdViewer.mapLocationSet(dataSetI);
        gajdViewer.addPrintLegendEntry(dataSetI);
    }
}

gajdViewer.addPrintLegendEntry = function (dataSetNo) {
    var legendDiv = document.getElementById('print_legend_box');
    
    var newLegendRow = document.createElement("p");
    newLegendRow.className = "legend_entry";
    legendDiv.appendChild(newLegendRow);
    
    var colorBlock = document.createElement("span");
    colorBlock.innerHTML = "■ ";
    colorBlock.style.color = gajdViewer.conditionsForDataSets[dataSetNo].color;
    newLegendRow.appendChild(colorBlock);
    
    var labelSpan = document.createElement("span");
    labelSpan.innerHTML = gajdViewer.conditionsForDataSets[dataSetNo].label.replace(/&/g, "&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    newLegendRow.appendChild(labelSpan);
}