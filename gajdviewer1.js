var gajdViewer = {
    _mapCanvasId: null,
    _conditionContainerId: null,
    _dataExportContainerId: null,
    _legendContainerId: null,
    _inspectorContainerId: null,
    _map: null, //holds the google map object
    _mapOptions: null,
    _styles: null,
    _lastValidCenter: null,
    _allowedBounds: null,
    
    mapData: [], //This will hold the data for each GAJD map as each one is loaded on an as-needed basis.
    //gajdMapsGraphed: [], // This behaves as a hash of mapNo's as keys and arrays of integers representing dataSetNo's as values
    dataSets: [],   //This holds all the locations in each data set.
                    //Each data set is an associative array with locations numbers as keys and
                    //arrays of objects for each map response (properties: mapNo, hwNo, prnNo, rsp, noteCode, note)
    conditionsForDataSets: [], // This holds all the conditions used for each data set.
    overlaysForDataSets: [] // This holds arrays of all the overlays shown on the map for each dataSet.
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
        qWord:          '起きる	動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          62,
        qNo:            '021',
        qWord:          '飽きる	動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          63,
        qNo:            '026',
        qWord:          '足りる	動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          64,
        qNo:            '018',
        qWord:          '開ける	動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          65,
        qNo:            '022',
        qWord:          '任せる	動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          66,
        qNo:            '017',
        qWord:          '寝る	動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          67,
        qNo:            '023',
        qWord:          '書く	動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          68,
        qNo:            '027',
        qWord:          '死ぬ	動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          69,
        qNo:            '019',
        qWord:          '来る	動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          70,
        qNo:            '020',
        qWord:          'する	動詞・終止形'
    },
    {
        colNo: 2,
        mapNo:          71,
        qNo:            '029',
        qWord:          '書く(人)	動詞・連体形'
    },
    {
        colNo: 2,
        mapNo:          72,
        qNo:            '001',
        qWord:          '起きない	動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          73,
        qNo:            '012',
        qWord:          '飽きない	動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          74,
        qNo:            '011',
        qWord:          '見ない	動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          75,
        qNo:            '010',
        qWord:          '借りない	動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          76,
        qNo:            '008',
        qWord:          '足りない	動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          77,
        qNo:            '006',
        qWord:          '開けない	動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          78,
        qNo:            '005',
        qWord:          '任せない	動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          79,
        qNo:            '002',
        qWord:          '寝ない	動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          80,
        qNo:            '007',
        qWord:          '書かない	動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          81,
        qNo:            '009',
        qWord:          '貸さない	動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          82,
        qNo:            '013',
        qWord:          '蹴らない	動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          83,
        qNo:            '003',
        qWord:          '来ない	動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          84,
        qNo:            '004',
        qWord:          'しない	動詞・否定形'
    },
    {
        colNo: 2,
        mapNo:          85,
        qNo:            '032',
        qWord:          '起きろ	動詞・命令形'
    },
    {
        colNo: 2,
        mapNo:          86,
        qNo:            '035',
        qWord:          '見ろ	動詞・命令形'
    },
    {
        colNo: 2,
        mapNo:          87,
        qNo:            '034',
        qWord:          '開けろ	動詞・命令形'
    },
    {
        colNo: 2,
        mapNo:          88,
        qNo:            '038',
        qWord:          '任せろ	動詞・命令形'
    },
    {
        colNo: 2,
        mapNo:          89,
        qNo:            '037',
        qWord:          '蹴れ	動詞・命令形'
    },
    {
        colNo: 2,
        mapNo:          90,
        qNo:            '036',
        qWord:          '来い	動詞・命令形'
    },
    {
        colNo: 2,
        mapNo:          91,
        qNo:            '033',
        qWord:          'しろ	動詞・命令形'
    },
    {
        colNo: 2,
        mapNo:          92,
        qNo:            '040',
        qWord:          '出した	動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          93,
        qNo:            '048',
        qWord:          '飽きた	動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          94,
        qNo:            '049',
        qWord:          '任せた	動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          95,
        qNo:            '046',
        qWord:          '行った	動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          96,
        qNo:            '041',
        qWord:          '書いた	動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          97,
        qNo:            '045',
        qWord:          '研いだ	動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          98,
        qNo:            '050',
        qWord:          '貸した	動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          99,
        qNo:            '052',
        qWord:          '建てた	動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          100,
        qNo:            '053',
        qWord:          '建った	動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          101,
        qNo:            '054',
        qWord:          '立った	動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          102,
        qNo:            '044',
        qWord:          '飛んだ	動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          103,
        qNo:            '043',
        qWord:          '飲んだ	動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          104,
        qNo:            '047',
        qWord:          '蹴った	動詞・過去形'
    },
    {
        colNo: 2,
        mapNo:          105,
        qNo:            '051',
        qWord:          '買った	動詞・過去形'
    },
    {
        colNo: 3,
        mapNo:          106,
        qNo:            '060',
        qWord:          '起きよう	動詞・意志形'
    },
    {
        colNo: 3,
        mapNo:          107,
        qNo:            '063',
        qWord:          '開けよう	動詞・意志形'
    },
    {
        colNo: 3,
        mapNo:          108,
        qNo:            '061',
        qWord:          '寝よう	動詞・意志形'
    },
    {
        colNo: 3,
        mapNo:          109,
        qNo:            '065',
        qWord:          '書こう	動詞・意志形'
    },
    {
        colNo: 3,
        mapNo:          110,
        qNo:            '064',
        qWord:          '来よう	動詞・意志形'
    },
    {
        colNo: 3,
        mapNo:          111,
        qNo:            '062',
        qWord:          'しよう	動詞・意志形'
    },
    {
        colNo: 3,
        mapNo:          112,
        qNo:            '067',
        qWord:          '書くだろう	動詞・推量形'
    },
    {
        colNo: 3,
        mapNo:          113,
        qNo:            '068',
        qWord:          '来るだろう	動詞・推量形'
    },
    {
        colNo: 3,
        mapNo:          114,
        qNo:            '069',
        qWord:          'するだろう	動詞・推量形'
    },
    {
        colNo: 3,
        mapNo:          115,
        qNo:            '025',
        qWord:          '書かれる	動詞・受身形'
    },
    {
        colNo: 3,
        mapNo:          116,
        qNo:            '072',
        qWord:          '来られると	動詞・受身形'
    },
    {
        colNo: 3,
        mapNo:          117,
        qNo:            '073',
        qWord:          'される	動詞・受身形'
    },
    {
        colNo: 3,
        mapNo:          118,
        qNo:            '077',
        qWord:          '開けさせる	動詞・使役'
    },
    {
        colNo: 3,
        mapNo:          119,
        qNo:            '024',
        qWord:          '書かせる	動詞・使役'
    },
    {
        colNo: 3,
        mapNo:          120,
        qNo:            '076',
        qWord:          '来させる	動詞・使役'
    },
    {
        colNo: 3,
        mapNo:          121,
        qNo:            '075',
        qWord:          'させる	動詞・使役'
    },
    {
        colNo: 3,
        mapNo:          122,
        qNo:            '039',
        qWord:          '書かせろ	動詞・使役'
    },
    {
        colNo: 3,
        mapNo:          123,
        qNo:            '042',
        qWord:          '書かせた	動詞・使役'
    },
    {
        colNo: 3,
        mapNo:          124,
        qNo:            '066',
        qWord:          '書かせよう	動詞・使役'
    },
    {
        colNo: 3,
        mapNo:          125,
        qNo:            '074',
        qWord:          '書かせられる	動詞・使役'
    },
    {
        colNo: 3,
        mapNo:          126,
        qNo:            '078',
        qWord:          '起きれば	動詞・仮定形１'
    },
    {
        colNo: 3,
        mapNo:          127,
        qNo:            '082',
        qWord:          '任せれば	動詞・仮定形１'
    },
    {
        colNo: 3,
        mapNo:          128,
        qNo:            '081',
        qWord:          '書けば	動詞・仮定形１'
    },
    {
        colNo: 3,
        mapNo:          129,
        qNo:            '083',
        qWord:          '死ねば	動詞・仮定形１'
    },
    {
        colNo: 3,
        mapNo:          130,
        qNo:            '079',
        qWord:          '来れば	動詞・仮定形１'
    },
    {
        colNo: 3,
        mapNo:          131,
        qNo:            '080',
        qWord:          'すれば	動詞・仮定形１'
    },
    {
        colNo: 3,
        mapNo:          132,
        qNo:            '085',
        qWord:          '起きるなら	動詞・仮定形２'
    },
    {
        colNo: 3,
        mapNo:          133,
        qNo:            '088',
        qWord:          '書くなら	動詞・仮定形２'
    },
    {
        colNo: 3,
        mapNo:          134,
        qNo:            '086',
        qWord:          '来るなら	動詞・仮定形２'
    },
    {
        colNo: 3,
        mapNo:          135,
        qNo:            '087',
        qWord:          'するなら	動詞・仮定形２'
    },
    {
        colNo: 3,
        mapNo:          136,
        qNo:            '030',
        qWord:          '高い(物)	形容詞'
    },
    {
        colNo: 3,
        mapNo:          137,
        qNo:            '014',
        qWord:          '高くない	形容詞'
    },
    {
        colNo: 3,
        mapNo:          138,
        qNo:            '057',
        qWord:          '高くて	形容詞'
    },
    {
        colNo: 3,
        mapNo:          139,
        qNo:            '058',
        qWord:          '高くなる	形容詞'
    },
    {
        colNo: 3,
        mapNo:          140,
        qNo:            '059',
        qWord:          '珍しくなる	形容詞'
    },
    {
        colNo: 3,
        mapNo:          141,
        qNo:            '055',
        qWord:          '高かった	形容詞'
    },
    {
        colNo: 3,
        mapNo:          142,
        qNo:            '070',
        qWord:          '高いだろう	形容詞'
    },
    {
        colNo: 3,
        mapNo:          143,
        qNo:            '084',
        qWord:          '高ければ	形容詞'
    },
    {
        colNo: 3,
        mapNo:          144,
        qNo:            '089',
        qWord:          '高いなら	形容詞'
    },
    {
        colNo: 3,
        mapNo:          145,
        qNo:            '028',
        qWord:          '静かだ	形容動詞'
    },
    {
        colNo: 3,
        mapNo:          146,
        qNo:            '031',
        qWord:          '静かな(ところ)	形容動詞'
    },
    {
        colNo: 3,
        mapNo:          147,
        qNo:            '015',
        qWord:          '静かでない	形容動詞'
    },
    {
        colNo: 3,
        mapNo:          148,
        qNo:            '056',
        qWord:          '静かだった	形容動詞'
    },
    {
        colNo: 3,
        mapNo:          149,
        qNo:            '071',
        qWord:          '静かだろう	形容動詞'
    },
    {
        colNo: 3,
        mapNo:          150,
        qNo:            '090',
        qWord:          '静かなら	形容動詞'
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
        qWord:          '行くな[よ]（やさしく)'
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
        qWord:          '行くな[よ]（きびしく)'
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
                                  dataExportContainerId,
                                  legendContainerId,
                                  inspectorContainerId) {
    this._mapCanvasId = mapCanvasId;
    this._conditionContainerId = conditionContainerId;
    this._dataExportContainerId = dataExportContainerId;
    this._legendContainerId = legendContainerId;
    this._inspectorContainerId = inspectorContainerId;
    
    this._mapOptions = {
        center: new google.maps.LatLng(gajdViewer.getCenterLat("550000"), gajdViewer.getCenterLng("550000")),
        zoom: 5,
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
    
    gajdViewer.addFormForCondition();
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
    newMapDropbox.style.fontFamily = "Meiryo, MS PGothic, Osaka, Mona Font, Hiragino Kaku Gothic";
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
    newFormsSelector.style.fontFamily = "Lucida Sans Unicode, Arial Unicode MS , Andika, Charis SIL, Doulos SIL, Gentium Plus, Meiryo, MS PGothic";
    conditionDiv.appendChild(newFormsSelector);
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


//gajdViewer.populateMapDropbox = function (dataSetNo, conditionSetNo, conditionNo) {
//    var colDropbox = document.getElementById("colDropbox" + dataSetNo + "_" + conditionSetNo + "_" + conditionNo)
//    var collectionNo = parseInt(colDropbox.value);
//    var mapDropbox = document.getElementById("mapDropbox" + dataSetNo + "_" + conditionSetNo + "_" + conditionNo);
//    var optionElement;
//    var firstMapNo;
//    var lastMapNo;
//    var i;
//    
//    // if this dropbox already was populated, and the user changed the collection number, then remove all of the options that it was previously populated with 
//    while (mapDropbox.childNodes.length > 1)
//    {
//        mapDropbox.removeChild(mapDropbox.childNodes[1]);
//    }
//    
//    // set the collection number based on the first
//    switch (collectionNo) {
//        case 1:
//            firstMapNo = 1;
//            lastMapNo = 60;
//            break;
//        case 2:
//            firstMapNo = 61;
//            lastMapNo = 105;
//            break;
//        case 3:
//            firstMapNo = 106;
//            lastMapNo = 150;
//            break;
//        case 4:
//            firstMapNo = 151;
//            lastMapNo = 205;
//            break;
//        case 5:
//            firstMapNo = 206;
//            lastMapNo = 270;
//            break;
//        case 6:
//            firstMapNo = 271;
//            lastMapNo = 350;
//            break;
//        default:
//            return null;
//    }
//    
//    for (i = firstMapNo - 1; i < lastMapNo; i++) {
//        optionElement = document.createElement("option");
//        optionElement.value = i + 1;
//        optionElement.appendChild(document.createTextNode("Map " + (i+1) + ": " + gajdViewer.mapNameList[i].qWord));
//        mapDropbox.appendChild(optionElement);
//    }
//    return true;
//}

gajdViewer.populateFormSelector = function (conditionNo) {
    var mapDropbox = document.getElementById("mapDropbox" + conditionNo);
    var mapNo = parseInt(mapDropbox.value);
    var formSelector = document.getElementById("formSelector" + conditionNo);
    var optionElement;
    
    // if this selection box already was populated, and the user changed the map number, then remove all of the options that it was previously populated with 
    while (formSelector.childNodes.length > 0) {
        formSelector.removeChild(formSelector.childNodes[0]);
    }
    
    // The following makes sure that the map is loaded (hence the call to gajdViewer.getMap())
    // and then populates the form selector with the headwords and pronunciation forms for the map.
    // The code for populating the form selector is enclosed within a callback passed to getMap().
    // Note that we don't need to do any of this if the user selected the default item in the map
    // selector (the case where mapNo == 0).
    if (mapNo != 0 ) {
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
// Disabled: 6) Note all the maps referenced by this dataSet in gajdViewer.gajdMapsGraphed    
// 7) Call support methods to find and display all the data that match the conditions specified
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
    var dataForm = document.getElementById("dataSetForm" + dataSetNo);
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
    
    // 7) Call support methods to find and display all the data that match the conditions specified
    gajdViewer.getLocationsForDataSet(dataSetNo);
    gajdViewer.mapLocationSet(dataSetNo);
    
    return true;
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

// this function is called when someone presses the button to display a dataset
// it should do the following:
// 1) Check to make sure that everything has been entered to create valid conditions for each condition form.
//    If there is any part of the form that is not properly completed (i.e. a condition where no map or no
//    forms are selected), then this function shall alert the user and do nothing further.
// 2) Extract the conditions from the form to an object of the following structure:
//    {
//      dataSetNo: an integer assigned to this data set
//      conditionSets: an array of condition sets, where each condition set is itself an array of conditions
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
// 4) Delete the form that was used to input this data set.
// 5) Call gajdViewer.addFormForDataSet(dataSetNo+1, null, null) to add a form for a new data set
// Disabled: 6) Note all the maps referenced by this dataSet in gajdViewer.gajdMapsGraphed    
// 7) Call support methods to find and display all the data that match the conditions specified
gajdViewer.extractDataSetConditionsFromForm = function (dataSetNo) {
    var newDataSet = {};
    var conditionSetI = 0;
    var conditionI = 0;
    var numberOfConditionSets = parseInt(document.getElementById("conditionSetsCounter" + dataSetNo).value);
    var numberOfConditions;
    var mapDropbox;
    var formSelector;
    var dataSetLabel = document.getElementById("label" + dataSetNo).value;
    var dataSetColor = document.getElementById("color" + dataSetNo).value;
    var colorRegExp = /^#[A-Fa-f0-9]{6}/;
    var formI;
    var newForm; // to hold the array when we split the selected form into its hwNo and prnNo components
    var dataForm = document.getElementById("dataSetForm" + dataSetNo);
    
    // 1) Validate form input
    // loop through each condition set
    for (conditionSetI = 0; conditionSetI < numberOfConditionSets; conditionSetI++)
    {
        numberOfConditions = parseInt(document.getElementById("conditionsCounter" + dataSetNo + "_" + conditionSetI).value);
        
        // loop through each condition in the condition set
        for (conditionI = 0; conditionI < numberOfConditions; conditionI++)
        {
            mapDropbox = document.getElementById("mapDropbox" + dataSetNo + "_" + conditionSetI + "_" + conditionI);
            formSelector = document.getElementById("formSelector" + dataSetNo + "_" + conditionSetI + "_" + conditionI);
            if (
                parseInt(mapDropbox.value) < 1 ||
                parseInt(mapDropbox.value) > 350 ||
                formSelector.selectedIndex == "-1" ||
                dataSetLabel.length == 0
            )
            {
                alert("You must select a map and at least one form for each condition and enter a label for the dataset.");
                return null;
            }
        }
    }
    
    // 2) Extract the conditions from the form to an object of the following structure:
    //    {
    //      dataSetNo: an integer assigned to this data set
    //      conditionSets: an array of condition sets, where each condition set is itself an array of conditions
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
    
    for (conditionSetI = 0; conditionSetI < numberOfConditionSets; conditionSetI++) {
        newDataSet.conditionSets.push([]); // add a new array to hold the conditions for the condition set
        numberOfConditions = parseInt(document.getElementById("conditionsCounter" + dataSetNo + "_" + conditionSetI).value);
        for (conditionI = 0; conditionI < numberOfConditions; conditionI++) {
            // add a new object to hold the individual condition
            newDataSet.conditionSets[conditionSetI].push({});
            mapDropbox = document.getElementById("mapDropbox" + dataSetNo + "_" + conditionSetI + "_" + conditionI);
            formSelector = document.getElementById("formSelector" + dataSetNo + "_" + conditionSetI + "_" + conditionI);
            
            newDataSet.conditionSets[conditionSetI][conditionI].mapNo = parseInt(mapDropbox.value);
            
            newDataSet.conditionSets[conditionSetI][conditionI].forms = [];
            for (formI = 0; formI < formSelector.length; formI++)
            {
                if (formSelector.options[formI].selected) {
                    newForm = formSelector.options[formI].value.split(":");
                    // first push an empty object, then set the hwNo and prnNo attributes of that object.
                    newDataSet.conditionSets[conditionSetI][conditionI].forms.push({hwNo: newForm[0],
                                                                                    prnNo: newForm[1]});
                }
            }
        }
    }
    
    // 3) Push the object holding the extracted and sorted conditionSets to gajdViewer.conditionsForDataSets
    gajdViewer.conditionsForDataSets.push(newDataSet);
    
    // 4) Delete the form that was used to input this data set.
    dataForm.parentNode.removeChild(dataForm);
    
    // 5) Call gajdViewer.addFormForDataSet(dataSetNo+1, null, null) to add a form for a new data set
    gajdViewer.addFormForDataSet(dataSetNo + 1, null, null);
    
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
    
    // 7) Call support methods to find and display all the data that match the conditions specified
    gajdViewer.getLocationsForDataSet(dataSetNo);
    gajdViewer.mapLocationSet(dataSetNo);
    
    return true;
}

// This function adds locations matching a set of conditions in the form to an existing
// set of locations corresponding 
gajdViewer.addToExistingSetFromForm = function () {
    
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
                // if in the rare case that the same location has forms associated with it for one map,
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
    
    gajdViewer.displayDataSetInLegend(dataSetNo);
}

gajdViewer.mapSingleLocation = function (locationNo, dataSetNo) {
    var rectOverlay = new google.maps.Rectangle({
        bounds: new google.maps.LatLngBounds(gajdViewer.getSWCorner(locationNo), gajdViewer.getNECorner(locationNo)),
	clickable: true,
	editable: false,
	fillColor: gajdViewer.conditionsForDataSets[dataSetNo].color,
        fillOpacity: 0.4,
	map: gajdViewer._map,
	strokeColor: gajdViewer.conditionsForDataSets[dataSetNo].color,
	strokeOpacity: 0.4,
	strokePosition: google.maps.StrokePosition.CENTER,
	strokeWeight: 1,
	visible: true,
        zIndex: dataSetNo
	});
    rectOverlay.gajdLocNo = locationNo;
    google.maps.event.addListener(gajdViewer._map, 'zoom_changed', function () {gajdViewer.adjustRectangleToViewLevel(rectOverlay);});
    google.maps.event.addListener(rectOverlay, 'click', function () {gajdViewer.displayLocationInInspector(locationNo)});
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

// returns a number representing the longitude of the center of 'box' on a GAJD map corresponding the locNo argument
gajdViewer.getCenterLng = function (locNo) {
    var lngNo = locNo.charAt(1) + locNo.charAt(3) + locNo.charAt(5);
    return 122.5 + ((147.5 - 122.5) * (parseInt(lngNo) + 0.5) / 1000);
}


// returns a google.maps.LatLng object for the south west corner of one of the 'boxes' on a GAJD map corresponding the locNo argument
gajdViewer.getSWCorner = function (locNo, scale) {
    var latNo = locNo.charAt(0) + locNo.charAt(2) + locNo.charAt(4);
    var upperLatitudeOfGrid = (45 + (40 / 60));
    var lowerLatitudeOfGrid = 29;
    if (arguments.length == 1) {
        scale = 1;
    }
    
    if (locNo.substr(0, 2) == "02" ||
        locNo.substr(0, 2) == "11" ||
        locNo.substr(0, 2) == "12" ||
        locNo.substr(0, 2) == "20" ||
        locNo.substr(0, 2) == "21")
    {
        latNo = "1" + latNo;
    }
    var latOfCorner = upperLatitudeOfGrid - ((upperLatitudeOfGrid - lowerLatitudeOfGrid) * (parseInt(latNo) + 1) / 1000);
    var latOfCenter = gajdViewer.getCenterLat(locNo);
    latOfCorner = latOfCenter - ((latOfCenter-latOfCorner) * scale);
    
    var lngNo = locNo.charAt(1) + locNo.charAt(3) + locNo.charAt(5);
    var lngOfCorner = 122.5 + ((147.5 - 122.5) * (parseInt(lngNo)) / 1000);
    var lngOfCenter = gajdViewer.getCenterLng(locNo);
    lngOfCorner = lngOfCenter - ((lngOfCenter-lngOfCorner) * scale);
    
    return new google.maps.LatLng(latOfCorner, lngOfCorner);
}

// returns a google.maps.LatLng object for the north east corner of one of the 'boxes' on a GAJD map corresponding the locNo argument
gajdViewer.getNECorner = function (locNo, scale) {
    var latNo = locNo.charAt(0) + locNo.charAt(2) + locNo.charAt(4);
    var upperLatitudeOfGrid = (45 + (40 / 60));
    var lowerLatitudeOfGrid = 29;
    if (arguments.length == 1) {
        scale = 1;
    }
    
    if (locNo.substr(0, 2) == "02" ||
        locNo.substr(0, 2) == "11" ||
        locNo.substr(0, 2) == "12" ||
        locNo.substr(0, 2) == "20" ||
        locNo.substr(0, 2) == "21")
    {
        latNo = "1" + latNo;
    }
    var latOfCorner = upperLatitudeOfGrid - ((upperLatitudeOfGrid - lowerLatitudeOfGrid) * (parseInt(latNo)) / 1000);
    var latOfCenter = gajdViewer.getCenterLat(locNo);
    latOfCorner = latOfCenter + ((latOfCorner - latOfCenter) * scale);
    
    var lngNo = locNo.charAt(1) + locNo.charAt(3) + locNo.charAt(5);
    var lngOfCorner = 122.5 + ((147.5 - 122.5) * (parseInt(lngNo) + 1) / 1000);
    var lngOfCenter = gajdViewer.getCenterLng(locNo);
    lngOfCorner = lngOfCenter + ((lngOfCorner - lngOfCenter) * scale);
    
    
    return new google.maps.LatLng(latOfCorner, lngOfCorner);    
}

gajdViewer.displayDataSetInLegend = function (dataSetNo) {
    var legendDiv = document.getElementById(gajdViewer._legendContainerId);
    
    var newLegendRow = document.createElement("p");
    newLegendRow.id = "legend_row" + dataSetNo;
    legendDiv.appendChild(newLegendRow);
    
    var colorBlock = document.createElement("span");
    colorBlock.innerHTML = "■ ";
    colorBlock.id = "color_block" + dataSetNo;
    colorBlock.onclick = function () {gajdViewer.enableColorChangeForm(dataSetNo, gajdViewer.conditionsForDataSets[dataSetNo].color)}
    colorBlock.style.color = gajdViewer.conditionsForDataSets[dataSetNo].color;
    newLegendRow.appendChild(colorBlock);
    
    var labelSpan = document.createElement("span");
    labelSpan.id = "label" + dataSetNo;
    labelSpan.onclick = function () {gajdViewer.enableLabelChangeForm(dataSetNo, gajdViewer.conditionsForDataSets[dataSetNo].label)}
    labelSpan.innerHTML = gajdViewer.conditionsForDataSets[dataSetNo].label;
    newLegendRow.appendChild(labelSpan);
}

gajdViewer.enableColorChangeForm = function (dataSetNo, color) {
    var colorSpan = document.getElementById("color_block" + dataSetNo);
    var legendRow = document.getElementById("legend_row" + dataSetNo);
    var labelSpan = document.getElementById("label" + dataSetNo);
    
    var newColorInput = document.createElement("input");
    newColorInput.type = "color";
    newColorInput.id = "newColorInput" + dataSetNo;
    newColorInput.value = color;
    newColorInput.onblur = function () {gajdViewer.changeColor(dataSetNo)};
    newColorInput.onchange = function () {gajdViewer.changeColor(dataSetNo)};
    
    legendRow.insertBefore(newColorInput, labelSpan);
    colorSpan.innerHTML = "";
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
    colorSpan.innerHTML = "■ ";
    legendRow.removeChild(newColorInput);
}

gajdViewer.enableLabelChangeForm = function (dataSetNo, labelText) {
    var labelSpan = document.getElementById("label" + dataSetNo);
    var legendRow = document.getElementById("legend_row" + dataSetNo);
    var newLabelInput = document.createElement("input");
    newLabelInput.type = "text";
    newLabelInput.id = "newLabelInput" + dataSetNo;
    newLabelInput.value = labelText;
    newLabelInput.onblur = function () {gajdViewer.changeLabelText(dataSetNo)};
    legendRow.appendChild(newLabelInput);
    labelSpan.innerHTML = "";
}

gajdViewer.changeLabelText = function (dataSetNo) {
    var labelSpan = document.getElementById("label" + dataSetNo);
    var legendRow = document.getElementById("legend_row" + dataSetNo);
    var newLabelInput = document.getElementById("newLabelInput" + dataSetNo);
    labelSpan.innerHTML = newLabelInput.value;
    gajdViewer.conditionsForDataSets[dataSetNo].label = newLabelInput.value;
    legendRow.removeChild(newLabelInput);
}


gajdViewer.displayLocationInInspector = function (locationNo) {
    var inspectorBox = document.getElementById(gajdViewer._inspectorContainerId);
    // get rid of any extraneous stuff in the inspector box
    while (inspectorBox.childNodes.length > 1) {
        inspectorBox.removeChild(inspectorBox.childNodes[1]);
    }
    
    //first, display the information about the location
    var headerElement = document.createElement("h3");
    headerElement.innerHTML = "Location No. " + locationNo +
                                "<br />Lat: " + (Math.round(gajdViewer.getCenterLat(locationNo)*10000)/10000) +
                                "<br />Lng: " + (Math.round(gajdViewer.getCenterLng(locationNo)*10000)/10000);
    inspectorBox.appendChild(headerElement);
    
    var divElement = document.createElement("div");
    divElement.style.borderStyle = 'dotted';
    divElement.style.borderWidth = 'thin';
    divElement.style.padding = '5px';
    
    for (var dataSetI = 0; dataSetI < gajdViewer.dataSets.length; dataSetI++) {
        if (gajdViewer.dataSets[dataSetI][locationNo]) {
            divElement.innerHTML = divElement.innerHTML + "<h4>From Data Set No. " + dataSetI + ": " +
                                                    gajdViewer.conditionsForDataSets[dataSetI].label + "</h4>";
            for (var datumI = 0; datumI < gajdViewer.dataSets[dataSetI][locationNo].length; datumI++) {
                var mapNo = gajdViewer.dataSets[dataSetI][locationNo][datumI].mapNo;
                var mapName = gajdViewer.mapNameList[parseInt(mapNo)-1].qWord;
                var hwNo = gajdViewer.dataSets[dataSetI][locationNo][datumI].hwNo;
                var hwForm = gajdViewer.mapData[mapNo].hws[hwNo].hwForm;
                var prnNo = gajdViewer.dataSets[dataSetI][locationNo][datumI].prnNo;
                var prnForm = (prnNo != undefined) ? gajdViewer.mapData[mapNo].hws[hwNo].prns[prnNo].prn : null;
                var rsp = gajdViewer.dataSets[dataSetI][locationNo][datumI].rsp;
                var note = gajdViewer.dataSets[dataSetI][locationNo][datumI].note;
                var noteCode = gajdViewer.dataSets[dataSetI][locationNo][datumI].noteCode;
                var formCode = (prnNo != undefined) ? (hwNo + ":" + prnNo) : hwNo;
                var form = (prnNo != undefined) ? (hwForm + " [" + prnForm + "]") : hwForm;
                
                divElement.innerHTML = divElement.innerHTML + "<p>Map No. " + mapNo + ": " +
                                     mapName + "<br />" +
                                     "Form " + formCode + ": " + form + "<br />" +
                                     "Response: " + rsp +
                                     ((note) ? ("<br />Notes: " + note) : "") +
                                     ((noteCode) ? ("<br />Note Codes: " + noteCode) : "") +
                                     "</ p>";
            }
        }
    }
    inspectorBox.appendChild(divElement);
}


gajdViewer.exportData = function () {
    
}

gajdViewer.saveStateToCode = function (textBoxId) {
    var saveStateTextBox = document.getElementById(textBoxId);
    saveStateTextBox.value = JSON.stringify(gajdViewer.conditionsForDataSets);
}

gajdViewer.recreateStateFromCode = function (textBoxId) {
    var saveStateTextBox = document.getElementById(textBoxId);
    gajdViewer.conditionsForDataSets = jQuery.parseJSON(saveStateTextBox.value);
    
    for (var dataSetI = 0; dataSetI < gajdViewer.conditionsForDataSets.length; dataSets++) {
        gajdViewer.getLocationsForDataSet(dataSetI);
        gajdViewer.mapLocationSet(dataSetI);
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