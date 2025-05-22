import React from 'react'

const  Dropdown = () => {

    const country =[
        {
            name:'English',
            icon:'https://d91ztyz4qy326.cloudfront.net/storeking/1/english.png',
    
        },
        {
            name:'Bangla',
            icon:'https://d91ztyz4qy326.cloudfront.net/storeking/2/bangla.png'
        },
        {
            name:'Arabic',
            icon:'https://d91ztyz4qy326.cloudfront.net/storeking/3/arabic.png'
        },
    ]

    return (
        <ul className='paper-content w-40 absolute top-12  ltr:right-0 rtl:left-0  shadow-paper rounded-lg z-10 p-2 bg-white  transition-all duration-300 group-hover:scale-y-100 shadow-md'> 
        {
            country.map((item,index)=>(

                <li key={index} className='flex items-center gap-3 px-2 py-1.5 rounded-lg relative w-full cursor-pointer transition-all duration-300 hover:bg-slate-100'>
                    <img  className="w-4 flex-shrink-0" src={item.icon} />
                    <p className='text-black font-medium text-sm'>{item.name}</p>
                </li>
                )
            ) 
        }
    </ul>
    )
}

export default Dropdown
