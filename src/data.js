export const properties=[
 {id:'CS-001',slug:'casa-del-sol',name:'Casa del Sol',country:'Spain',city:'Marbella',kind:'sale',type:'villa',beds:4,baths:4,area:420,price:2450000,image:1,tag:'coastal',amenities:['terrace','pool','garden']},
 {id:'CS-002',slug:'villa-serena',name:'Villa Serena',country:'Italy',city:'Lake Como',kind:'sale',type:'villa',beds:5,baths:4,area:510,price:3800000,image:2,tag:'waterside',amenities:['terrace','garden','parking']},
 {id:'CS-003',slug:'the-mitte-residence',name:'The Mitte Residence',country:'Germany',city:'Berlin',kind:'rent',type:'apartment',beds:2,baths:2,area:145,price:4200,image:3,tag:'city',amenities:['terrace','parking','workspace']},
 {id:'CS-004',slug:'riad-noor',name:'Riad Noor',country:'Morocco',city:'Marrakech',kind:'sale',type:'house',beds:4,baths:4,area:360,price:980000,image:4,tag:'courtyard',amenities:['terrace','pool','garden']},
 {id:'CS-005',slug:'atlantic-house',name:'Atlantic House',country:'South Africa',city:'Cape Town',kind:'rent',type:'house',beds:3,baths:3,area:290,price:6500,image:5,tag:'coastal',amenities:['terrace','pool','parking']},
 {id:'CS-006',slug:'the-pacific-retreat',name:'The Pacific Retreat',country:'USA',city:'Los Angeles',kind:'sale',type:'house',beds:4,baths:3,area:380,price:3200000,image:6,tag:'garden',amenities:['garden','pool','workspace']}
];
export const portfolio=[
 {name:'The Mediterranean Collection',countries:['Spain','Italy'],image:2},
 {name:'City & Sanctuary',countries:['Germany','Morocco'],image:4},
 {name:'Atlantic to Pacific',countries:['South Africa','USA'],image:6}
];
export const articles=[
 {slug:'finding-your-place',titleKey:'article1',categoryKey:'living',image:1,bodyKeys:['article1p1','article1p2','article1p3']},
 {slug:'a-considered-rental',titleKey:'article2',categoryKey:'renting',image:3,bodyKeys:['article2p1','article2p2','article2p3']},
 {slug:'the-language-of-space',titleKey:'article3',categoryKey:'design',image:4,bodyKeys:['article3p1','article3p2','article3p3']}
];
export function filterProperties(values={}){return properties.filter(p=>(!values.country||p.country===values.country)&&(!values.kind||p.kind===values.kind)&&(!values.type||p.type===values.type)&&(!values.max||p.price<=Number(values.max))&&(!values.beds||p.beds>=Number(values.beds)));}
