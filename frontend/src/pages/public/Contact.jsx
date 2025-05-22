import React from 'react'

function Contact() {
  return (
    <div>
      <section className="mb-10 sm:mb-20">
            <div className="container">
                <div className="mb-6">
                    <h2 className="text-[26px] leading-10 font-semibold capitalize mb-2">Contact Us</h2>
                    <div className="text-description pageHeading">
                        <p>Questions, Concerns, Comments? You talk, we listen.</p>
                        <p>If you have any additional questions or comments, we would love to hear from you!</p>
                        <p>Submit your query using any of the methods below.</p>
                        <p><br/></p>
                        <p>Email: info@inilabs.net</p>
                        <p>Toll-free number: +88013333846282, 7 days a week</p>
                    </div>
                </div>
                <div>
                    <div className="row mb-7">
                        <div className="col-12 sm:col-6 mb-2">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center bg-primary"><i className="lab lab-line-branches text-white !text-xs"></i></span>
                                <h3 className="font-medium leading-6">Mirpur 1</h3>
                            </div>
                            <ul className="flex flex-col gap-2">
                                <li className="flex items-center gap-2.5"><i className="lab lab-line-location lab-font-size-14"></i><span className="text-sm leading-6 text-heading"><span>House :31, Road: 9, Block: A, Mirpur 1</span></span></li>
                                <li className="flex items-center gap-2.5"><i className="lab lab-call-calling lab-font-size-14"></i><span className="text-sm leading-6 text-heading">+8801325736364</span></li>
                            </ul>
                        </div>
                        <div className="col-12 sm:col-6 mb-2">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center bg-primary"><i className="lab lab-line-branches text-white !text-xs"></i></span>
                                <h3 className="font-medium leading-6">Gulshan 1</h3>
                            </div>
                            <ul className="flex flex-col gap-2">
                                <li className="flex items-center gap-2.5"><i className="lab lab-line-location lab-font-size-14"></i><span className="text-sm leading-6 text-heading"><span>House :20, Road: 19, Block: B, Gulshan 1,Dhaka 1212</span></span></li>
                                <li className="flex items-center gap-2.5"><i className="lab lab-call-calling lab-font-size-14"></i><span className="text-sm leading-6 text-heading">+8801275362435</span></li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-[22px] leading-[34px] font-medium capitalize mb-3">Support</h2>
                        <ul className="flex flex-col gap-2">
                            <li className="flex items-center gap-2.5"><i className="lab lab-line-mail lab-font-size-14"></i><span className="text-sm leading-6 text-heading">info@inilabs.net</span></li>
                            <li className="flex items-center gap-2.5"><i className="lab lab-call-calling lab-font-size-14"></i><span className="text-sm font-medium leading-6 text-heading">+8801333384628</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Contact
