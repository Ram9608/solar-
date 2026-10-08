import React from "react"

export default function PrintQuotation({ quoteResult, selectedCustomer }: any) {
  const dateStr = new Date().toLocaleDateString("en-GB")
  const refNo = `SRE-${dateStr.replace(/\//g, "")}-A${Math.floor(Math.random() * 1000)}`

  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white text-black p-6 font-serif print-page relative w-full" style={{ fontSize: "13px", lineHeight: "1.5", minHeight: "1050px", boxSizing: "border-box" }}>
      {/* Outer borders mimicking the PDF */}
      <div className="absolute inset-2 border-2 border-black pointer-events-none rounded-sm"></div>
      <div className="absolute inset-[11px] border border-orange-400 pointer-events-none rounded-sm"></div>
      
      <div className="relative z-10 px-4 py-2">
        {/* Header */}
        <div className="flex flex-col items-center pb-2 mb-4 border-b-2 border-orange-200 relative">
          <div className="absolute left-0 top-0 w-16 h-12 flex items-center justify-center">
            {/* Logo placeholder */}
            <div className="flex flex-col items-center">
              <div className="flex gap-1 text-[8px] text-orange-500 font-bold leading-none">
                <span className="text-blue-500">▲</span><span className="text-red-500">▲</span>
              </div>
              <span className="font-bold text-red-800 text-[10px]">SRE</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-red-600 italic tracking-wide" style={{ fontFamily: "Georgia, serif", textShadow: "1px 1px 0px rgba(255,200,200,0.5)" }}>
            SHRI RAMREKHA ENTERPRISES
          </h1>
          <p className="text-blue-600 text-[15px] font-semibold mt-1 tracking-wide">( A Complete Solar Service & Solution )</p>
          <p className="text-blue-600 text-sm font-semibold underline underline-offset-4 mt-0.5">(GSTIN: 20DMTPB8216B1ZH)</p>
        </div>

        {children}
      </div>
    </div>
  )

  return (
    <div className="print-container bg-gray-100 p-4 print:p-0 print:bg-white flex flex-col gap-8 print:gap-0">
      
      {/* Page 1 */}
      <PageWrapper>
        {/* Ref & Date */}
        <div className="flex justify-between mb-2 text-red-700 font-medium">
          <div>Ref. No – {refNo}</div>
          <div>Date – {dateStr}</div>
        </div>

        {/* To */}
        <div className="mb-4 text-black">
          To,<br />
          Mr. {selectedCustomer?.name || "B D Singh"}<br />
          {selectedCustomer?.address || "Near Anand Marg SCHO Ranchi Jharkhand"}
        </div>

        {/* Subject */}
        <div className="font-bold mb-4 text-black text-[14px]">
          Sub:- <span className="font-bold">Quotation for On-Grid {quoteResult.systemSizeKW}Kw Solar Roof Top</span>
        </div>

        <div className="mb-4 text-black">
          Dear Sir,<br /><br />
          This is the reference to our discussion with you, regarding supply, installation and commissioning of Solar Power Plant (On-Grid) at your house.
        </div>

        {/* Brief */}
        <div className="font-bold mb-1 uppercase">BRIEF ON POWER PLANT OPERATION MODEL</div>
        <div className="mb-4 text-black text-justify">
          This power plant would be simultaneously connected and synchronized to grid. The existing transmission line would transport the power from Grid to load if solar power is not sufficiently available. In case of Grid failure/power cuts, the grid tie inverter would shut down and discontinue supply of power as the system is an on-grid one
        </div>

        <div className="font-bold mb-1 uppercase">POWER PLANT OPERATION MODEL</div>
        <div className="mb-4 text-black text-justify space-y-2">
          <p>1. When solar power is sufficient to power the loads in use, the first preference for the loads will be from the solar power plant. Excess power generated will be exported back to grid where facility for same is available with infrastructure.</p>
          <p>2. When solar energy power generation becomes insufficient to manage the load the remainder will be met from conventional electrical grid.</p>
        </div>

        {/* Table */}
        <table className="w-full border-collapse border border-orange-300 text-[11px] mb-6 mt-6">
          <thead className="bg-[#facc15] text-white font-bold">
            <tr className="bg-[#facc15] text-black">
              <th className="border border-orange-300 p-1.5 text-center w-8">Sr.<br/>No.</th>
              <th className="border border-orange-300 p-1.5 text-left text-white bg-yellow-400">Name of Product</th>
              <th className="border border-orange-300 p-1.5 text-center text-white bg-yellow-400 w-10">QTY</th>
              <th className="border border-orange-300 p-1.5 text-center text-white bg-yellow-400 w-12">Unit</th>
              <th className="border border-orange-300 p-1.5 text-right text-white bg-yellow-400">Rate</th>
              <th className="border border-orange-300 p-1.5 text-right text-white bg-yellow-400">Taxable<br/>Value</th>
              <th className="border border-orange-300 p-1.5 text-center text-white bg-yellow-400" colSpan={2}>CGST<br/><span className="text-[9px]">Rate &nbsp;&nbsp; Amount</span></th>
              <th className="border border-orange-300 p-1.5 text-center text-white bg-yellow-400" colSpan={2}>SGST<br/><span className="text-[9px]">Rate &nbsp;&nbsp; Amount</span></th>
              <th className="border border-orange-300 p-1.5 text-right text-white bg-yellow-400">Total</th>
            </tr>
          </thead>
          <tbody className="text-black">
            <tr>
              <td className="border border-orange-300 p-2 text-center font-bold">1</td>
              <td className="border border-orange-300 p-2 bg-white">Principle supply of (PREMIER) solar on grid {quoteResult.systemSizeKW}Kwp spgs system</td>
              <td className="border border-orange-300 p-2 text-center bg-white">1</td>
              <td className="border border-orange-300 p-2 text-center bg-white">SET</td>
              <td className="border border-orange-300 p-2 text-right bg-white">{Math.round(quoteResult.subtotal * 0.8).toLocaleString()}</td>
              <td className="border border-orange-300 p-2 text-right bg-white">{Math.round(quoteResult.subtotal * 0.8).toLocaleString()}</td>
              <td className="border border-orange-300 p-2 text-center bg-white border-r-0">2.5%</td>
              <td className="border border-orange-300 p-2 text-right bg-white border-l-0">{Math.round((quoteResult.subtotal * 0.8) * 0.025).toLocaleString()}</td>
              <td className="border border-orange-300 p-2 text-center bg-white border-r-0">2.5%</td>
              <td className="border border-orange-300 p-2 text-right bg-white border-l-0">{Math.round((quoteResult.subtotal * 0.8) * 0.025).toLocaleString()}</td>
              <td className="border border-orange-300 p-2 text-right bg-white">{Math.round(quoteResult.subtotal * 0.8 * 1.05).toLocaleString()}</td>
            </tr>
            <tr>
              <td className="border border-orange-300 p-2 text-center bg-[#fefce8] font-bold">2</td>
              <td className="border border-orange-300 p-2 bg-[#fefce8]">{quoteResult.systemSizeKW}Kwp AC side material supply & Installation</td>
              <td className="border border-orange-300 p-2 text-center bg-[#fefce8]">1</td>
              <td className="border border-orange-300 p-2 text-center bg-[#fefce8]">SET</td>
              <td className="border border-orange-300 p-2 text-right bg-[#fefce8]">{Math.round(quoteResult.subtotal * 0.2).toLocaleString()}</td>
              <td className="border border-orange-300 p-2 text-right bg-[#fefce8]">{Math.round(quoteResult.subtotal * 0.2).toLocaleString()}</td>
              <td className="border border-orange-300 p-2 text-center bg-[#fefce8] border-r-0">9%</td>
              <td className="border border-orange-300 p-2 text-right bg-[#fefce8] border-l-0">{Math.round((quoteResult.subtotal * 0.2) * 0.09).toLocaleString()}</td>
              <td className="border border-orange-300 p-2 text-center bg-[#fefce8] border-r-0">9%</td>
              <td className="border border-orange-300 p-2 text-right bg-[#fefce8] border-l-0">{Math.round((quoteResult.subtotal * 0.2) * 0.09).toLocaleString()}</td>
              <td className="border border-orange-300 p-2 text-right bg-[#fefce8]">{Math.round(quoteResult.subtotal * 0.2 * 1.18).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {/* Totals & T&C */}
        <div className="flex justify-between mt-auto pb-8">
          <div className="w-[55%]">
            <div className="font-bold mb-2 text-black">Term and Conditions:</div>
            <ol className="list-decimal pl-5 space-y-1 text-black text-xs">
              <li>This is an electronic generated document.</li>
              <li>All disputes are subject to Ranchi Jharkhand jurisdiction.</li>
              <li>After finalization of order material to be supplied in 15 days.</li>
            </ol>
            
            <div className="mt-8">
              <span className="text-[#eab308] text-lg leading-none mr-1">◆●</span> 
              <span className="font-bold text-slate-800 text-sm">Shri Ramrekha Enterprises</span><br />
              <div className="pl-6 font-bold text-sm">A Complete Solar Service & Solution</div>
              <div className="pl-6 mt-1 flex items-start gap-1">
                <span className="text-gray-400 text-[10px] mt-0.5">ℹ</span>
                <span className="font-bold">Address:</span> – Pugru Chapatoli Tupudana, Ranchi 834003
              </div>
            </div>
          </div>
          <div className="w-[42%]">
            <table className="w-full border-collapse text-[12px]">
              <tbody>
                <tr className="bg-[#facc15] font-bold">
                  <td className="p-1.5 px-3 border border-orange-300 text-white">Taxable Amount</td>
                  <td className="p-1.5 border border-orange-300 text-center text-white">:</td>
                  <td className="p-1.5 px-3 border border-orange-300 text-right text-white">₹{Math.round(quoteResult.subtotal).toLocaleString()}</td>
                </tr>
                <tr className="bg-[#fefce8] font-bold text-black">
                  <td className="p-1.5 px-3 border border-orange-300">Add : CGST</td>
                  <td className="p-1.5 border border-orange-300 text-center">:</td>
                  <td className="p-1.5 px-3 border border-orange-300 text-right">₹{Math.round(quoteResult.gst / 2).toLocaleString()}</td>
                </tr>
                <tr className="bg-[#fefce8] font-bold text-black">
                  <td className="p-1.5 px-3 border border-orange-300">Add : SGST</td>
                  <td className="p-1.5 border border-orange-300 text-center">:</td>
                  <td className="p-1.5 px-3 border border-orange-300 text-right">₹{Math.round(quoteResult.gst / 2).toLocaleString()}</td>
                </tr>
                <tr className="bg-[#fefce8] font-bold text-black">
                  <td className="p-1.5 px-3 border border-orange-300">Tax Amount : GST</td>
                  <td className="p-1.5 border border-orange-300 text-center">:</td>
                  <td className="p-1.5 px-3 border border-orange-300 text-right">₹{Math.round(quoteResult.gst).toLocaleString()}</td>
                </tr>
                <tr className="bg-[#fefce8] font-bold text-black">
                  <td className="p-1.5 px-3 border border-orange-300">Total Amount</td>
                  <td className="p-1.5 border border-orange-300 text-center">:</td>
                  <td className="p-1.5 px-3 border border-orange-300 text-right">₹{Math.round(quoteResult.totalCost).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </PageWrapper>

      <div className="print:hidden w-full h-8" />
      <div className="hidden print:block" style={{ pageBreakBefore: "always" }} />

      {/* Page 2 */}
      <PageWrapper>
        <div className="mt-4 mb-4">
          <span className="text-[#eab308] text-lg leading-none mr-1">◆●</span> 
          <span className="font-bold text-slate-800 text-sm">Shri Ramrekha Enterprises</span><br />
          <div className="pl-6 font-bold text-sm">A Complete Solar Service & Solution</div>
          <div className="pl-6 mt-1 flex items-start gap-1">
            <span className="text-gray-400 text-[10px] mt-0.5">ℹ</span>
            <span className="font-bold">Address:</span> – Pugru Chapatoli Tupudana, Ranchi 834003
          </div>
        </div>

        {/* Material Specs */}
        <table className="w-full border-collapse border border-black mb-8 text-[12px]">
          <thead>
            <tr>
              <th className="border border-black p-2 bg-gray-100 text-[14px]" colSpan={2}>Material Specifications</th>
            </tr>
            <tr className="bg-white">
              <th className="border border-black p-2 w-1/2">Material Description</th>
              <th className="border border-black p-2 w-1/2">Specifications</th>
            </tr>
          </thead>
          <tbody className="text-center">
            <tr>
              <td className="border border-black p-1.5">Solar Panels</td>
              <td className="border border-black p-1.5">{quoteResult.panelChoice}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Inverter</td>
              <td className="border border-black p-1.5">{quoteResult.inverterChoice}</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">AC DB</td>
              <td className="border border-black p-1.5">IP66 Box, DP MCB, SPD, Connector/Equivalent</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">DC DB</td>
              <td className="border border-black p-1.5">IP66 Box, DC MCB, SPD, Fuse & Fuse link/ Equivalent</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">AC Cable</td>
              <td className="border border-black p-1.5">Polycab/ Equivalent(6MM)</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">DC Cable</td>
              <td className="border border-black p-1.5">Polycab/ Equivalent(4MM)</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">LA Cable</td>
              <td className="border border-black p-1.5">WaaCab (16MM)</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Lightning Arrestor</td>
              <td className="border border-black p-1.5">Multy/Single spike- Excel earthing/ Equivalent</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Earth Rod</td>
              <td className="border border-black p-1.5">3FT, 100 microns copper bonded Excel earthing / Equivalent</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">No. 10 COPPER</td>
              <td className="border border-black p-1.5">swg 10/ Equivalent</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Earth bench</td>
              <td className="border border-black p-1.5">3 hole-Excel earthing/ Equivalent</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Insulation Tape</td>
              <td className="border border-black p-1.5">red, blue, yellow, black, green/ Equivalent</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Cycle screw and washer</td>
              <td className="border border-black p-1.5">3mm, 1 inch/ Equivalent</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Ring socket 6-10</td>
              <td className="border border-black p-1.5">Copper</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Cable Tie</td>
              <td className="border border-black p-1.5">3.2*300mm</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Screw 1" (dry wall)</td>
              <td className="border border-black p-1.5">1 inch</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Fastner</td>
              <td className="border border-black p-1.5">8mm/10mm As per Site</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Green Colour Sleeve</td>
              <td className="border border-black p-1.5">Green</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Earth Pit Chamber</td>
              <td className="border border-black p-1.5">18x18/ Equivalent(3)</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Earthing Compound 15Kg</td>
              <td className="border border-black p-1.5">15kg/3 packet</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Main switch</td>
              <td className="border border-black p-1.5">32A - V.Guard/ Equivalent</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Meter Box</td>
              <td className="border border-black p-1.5">With main prov.-MSM/ Equivalent(if required)</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Flexible Pipe (20mm/25mm)</td>
              <td className="border border-black p-1.5">20MM /25MM PRECEISION/ Equivalent</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">PIPES AND FITTINGS</td>
              <td className="border border-black p-1.5">Geo/Precision/ Equivalent</td>
            </tr>
          </tbody>
        </table>
      </PageWrapper>

      <div className="print:hidden w-full h-8" />
      <div className="hidden print:block" style={{ pageBreakBefore: "always" }} />

      {/* Page 3 */}
      <PageWrapper>
        <div className="font-bold mb-4 mt-6 text-[14px]">Scope of work</div>
        <table className="w-full border-collapse border border-black mb-6 text-[13px]">
          <tbody>
            <tr>
              <td className="border border-black p-2 w-1/2">System Type</td>
              <td className="border border-black p-2">On Grid</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Plant capacity (Kw)</td>
              <td className="border border-black p-2">{quoteResult.systemSizeKW}</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Total Area Covered (Sq.ft)</td>
              <td className="border border-black p-2">{quoteResult.systemSizeKW * 70} (approx)</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Type of Mounting</td>
              <td className="border border-black p-2">RCC- Fixed Tilt-standard</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Tilt Angle</td>
              <td className="border border-black p-2">23º - 25º As per site Location</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Transportation of material</td>
              <td className="border border-black p-2">As per actual transport cost</td>
            </tr>
            <tr>
              <td className="border border-black p-2">GST</td>
              <td className="border border-black p-2">As applicable</td>
            </tr>
            <tr>
              <td className="border border-black p-2">Payment term</td>
              <td className="border border-black p-2">80% advance, 20% when material is delivered at site.</td>
            </tr>
          </tbody>
        </table>

        <div className="space-y-3 mb-10 text-[13px]">
          <p>a) System sizing/ design and engineering, procurement and supply of projects related material.</p>
          <p>b) Civil activities which shall consist of foundation, pedestal and cable conduit fittings.</p>
          <p>c) Erection work of module mounting structure.</p>
          <p>d) Installed of solar Module, Inverter, Earthing, Lightning Arresters, etc.</p>
          <p>e) Complete wiring work related to solar rooftop.</p>
          <p>f) Facilitation of Net-metering inclusive of application processing, meter replacement etc. as per norms.</p>
          <p>g) Commissioning of Plant</p>
        </div>

        <table className="w-full border-collapse border border-black mb-12 text-center text-[12px]">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-black p-2">ACCOUNT HOLDER</th>
              <th className="border border-black p-2">ACCOUNT NO.</th>
              <th className="border border-black p-2">IFCS CODE</th>
              <th className="border border-black p-2">BANK</th>
              <th className="border border-black p-2">BRANCH</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#fde047] font-bold">
              <td className="border border-black p-2 leading-tight">SHRI RAMREKHA<br/>ENTERPRISES<br/><span className="text-[9px] font-normal">(GSTIN:<br/>20DMTPB8216B1ZH)</span></td>
              <td className="border border-black p-2">50200104032629</td>
              <td className="border border-black p-2">HDFC0005770</td>
              <td className="border border-black p-2">HDFC BANK<br/>LTD</td>
              <td className="border border-black p-2 text-left">SINGH MORE,<br/>HATIA, RANCHI-<br/>834003,<br/>JHARKHAND</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-16 text-[13px] leading-relaxed">
          Thanking you<br/>
          Yours Faithfully,<br/>
          Vivek Kumar Baraik<br/>
          <span className="font-bold">(SHRI RAMREKHA ENTERPRISES) (GSTIN: 20DMTPB8216B1ZH)</span>
        </div>
      </PageWrapper>
    </div>
  )
}
