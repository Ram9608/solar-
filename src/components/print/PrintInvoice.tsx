import React from "react"

export default function PrintInvoice({ quoteResult, selectedCustomer }: any) {
  const dateStr = new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-')
  
  return (
    <div className="print-container bg-gray-100 p-4 print:p-0 print:bg-white flex flex-col items-center">
      <div className="bg-white text-black p-8 font-sans print-page w-full" style={{ fontSize: "11px", lineHeight: "1.2", minHeight: "1050px", boxSizing: "border-box" }}>
        <div className="text-center font-bold text-sm mb-1 uppercase tracking-widest">PROFORMA INVOICE</div>
      
      <table className="w-full border-collapse border border-black mb-4">
        <tbody>
          <tr>
            <td className="border border-black p-2 align-top w-[55%]">
              <div className="flex gap-2">
                <div className="w-20 h-20 rounded-full border border-blue-500 overflow-hidden flex-shrink-0 flex items-center justify-center bg-blue-50">
                  <span className="text-[8px] font-bold text-center text-blue-800">SRI GDH POWER<br/>SOLUTION</span>
                </div>
                <div>
                  <div className="font-bold">SRI GDH POWER SOLUTION PVT LTD. - (1.04.24 to 2027)</div>
                  <div>1C, 1ST FLOOR, UNI HIGH BUILDING, OLD</div>
                  <div>H.B ROAD, GARHA TOLI, RANCHI-834001</div>
                  <div>(JHARKHAND)</div>
                  <div>UDYAM REGISTRATION NO: UDYAM-JH-20-0043824</div>
                  <div>GSTIN/UIN: 20AILPM6747R1ZK</div>
                  <div>State Name : Jharkhand, Code : 20</div>
                  <div>E-Mail : srigdh.powersolution@gmail.com</div>
                </div>
              </div>
            </td>
            <td className="border border-black align-top p-0 w-[45%]">
              <table className="w-full h-full border-collapse">
                <tbody>
                  <tr>
                    <td className="border-b border-r border-black p-2 w-1/2">
                      <div className="text-[10px] text-gray-600">Voucher No.</div>
                      <div className="font-bold">703</div>
                    </td>
                    <td className="border-b border-black p-2 w-1/2">
                      <div className="text-[10px] text-gray-600">Dated</div>
                      <div className="font-bold">{dateStr}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border-b border-r border-black p-2" colSpan={2}>
                      <div className="text-[10px] text-gray-600">Mode/Terms of Payment</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border-b border-r border-black p-2">
                      <div className="text-[10px] text-gray-600">Buyer's Ref./Order No.</div>
                      <div className="font-bold">703</div>
                    </td>
                    <td className="border-b border-black p-2">
                      <div className="text-[10px] text-gray-600">Other References</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border-r border-black p-2">
                      <div className="text-[10px] text-gray-600">Dispatched through</div>
                    </td>
                    <td className="p-2">
                      <div className="text-[10px] text-gray-600">Destination</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 align-top">
              <div className="text-[10px] text-gray-600">Consignee (Ship to)</div>
              <div className="font-bold uppercase">M/S {selectedCustomer?.name || "ALLIANCE ENTERPRISES"}</div>
              <div className="uppercase">{selectedCustomer?.address || "KEDAL, NEORI VIKASH, NEAR VASTU, VIHAR, PHASE-2, FURHARA TOLI, BIT, MESHRA, RANCHI, Ranchi, Jharkhand, 835217"}</div>
              <div>GSTIN/UIN : 20BJFPD9489M1ZT</div>
              <div>State Name : Jharkhand, Code : 20</div>
            </td>
            <td className="border border-black p-2 align-top" rowSpan={2}>
              <div className="text-[10px] text-gray-600">Terms of Delivery</div>
            </td>
          </tr>
          <tr>
            <td className="border border-black p-2 align-top">
              <div className="text-[10px] text-gray-600">Buyer (Bill to)</div>
              <div className="font-bold uppercase">M/S {selectedCustomer?.name || "ALLIANCE ENTERPRISES"}</div>
              <div className="uppercase">{selectedCustomer?.address || "KEDAL, NEORI VIKASH, NEAR VASTU, VIHAR, PHASE-2, FURHARA TOLI, BIT, MESHRA, RANCHI, Ranchi, Jharkhand, 835217"}</div>
              <div>GSTIN/UIN : 20BJFPD9489M1ZT</div>
              <div>State Name : Jharkhand, Code : 20</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Items Table */}
      <table className="w-full border-collapse border border-black mb-0 h-[600px] table-fixed">
        <thead>
          <tr>
            <th className="border border-black p-1 w-8">Sl No.</th>
            <th className="border border-black p-1">Description of Goods</th>
            <th className="border border-black p-1 w-16">HSN/SAC</th>
            <th className="border border-black p-1 w-12">GST Rate</th>
            <th className="border border-black p-1 w-16">Due on</th>
            <th className="border border-black p-1 w-16 text-right">Quantity</th>
            <th className="border border-black p-1 w-16 text-right">Rate</th>
            <th className="border border-black p-1 w-10">per</th>
            <th className="border border-black p-1 w-20 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {quoteResult.billOfMaterials.map((item: any, idx: number) => (
            <tr key={idx} className="align-top h-6">
              <td className="border-x border-black p-1 text-center">{idx + 1}</td>
              <td className="border-x border-black p-1 font-bold uppercase">{item.item}</td>
              <td className="border-x border-black p-1 text-center">85371000</td>
              <td className="border-x border-black p-1 text-center">18 %</td>
              <td className="border-x border-black p-1 text-center">{dateStr}</td>
              <td className="border-x border-black p-1 text-right font-bold">{item.qty} {item.unit}</td>
              <td className="border-x border-black p-1 text-right">{item.rate.toFixed(2)}</td>
              <td className="border-x border-black p-1 text-center">{item.unit}</td>
              <td className="border-x border-black p-1 text-right font-bold">{item.total.toFixed(2)}</td>
            </tr>
          ))}
          {/* Empty rows to push totals down */}
          <tr className="align-top h-full">
            <td className="border-x border-black p-1"></td>
            <td className="border-x border-black p-1">
              <div className="mt-8 text-right font-bold italic">CGST</div>
              <div className="text-right font-bold italic">SGST</div>
            </td>
            <td className="border-x border-black p-1"></td>
            <td className="border-x border-black p-1"></td>
            <td className="border-x border-black p-1"></td>
            <td className="border-x border-black p-1"></td>
            <td className="border-x border-black p-1"></td>
            <td className="border-x border-black p-1"></td>
            <td className="border-x border-black p-1 text-right font-bold">
              <div className="mt-8">{(quoteResult.gst / 2).toFixed(2)}</div>
              <div>{(quoteResult.gst / 2).toFixed(2)}</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Totals */}
      <table className="w-full border-collapse border-b border-l border-r border-black mb-4">
        <tbody>
          <tr>
            <td className="border border-black p-1 text-right font-bold" colSpan={8}>Total</td>
            <td className="border border-black p-1 text-right font-bold w-24">₹ {quoteResult.totalCost.toFixed(2)}</td>
          </tr>
          <tr>
            <td className="p-2 align-top" colSpan={9}>
              <div className="text-[10px] text-gray-600 mb-1">Amount Chargeable (in words)</div>
              <div className="font-bold">INR {Number(quoteResult.totalCost).toLocaleString('en-IN')} Only</div>
              <div className="text-right text-xs italic -mt-4">E. & O.E</div>
            </td>
          </tr>
          <tr>
            <td className="p-2 border-t border-black align-top" colSpan={9}>
              <div className="flex justify-between items-end mt-4">
                <div className="w-24 h-24 border border-black flex flex-col items-center justify-center bg-gray-50">
                  <span className="text-[10px] text-gray-400">QR CODE</span>
                  <span className="text-[10px]">Scan to pay</span>
                </div>
                <div className="text-right">
                  <div className="font-bold mb-8">for SRI GDH POWER SOLUTION PVT LTD. - (1.04.24 to 2027)</div>
                  <div className="border-t border-gray-400 inline-block px-4 pt-1 text-[10px]">Authorised Signatory</div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

        <div className="text-center text-[9px] text-gray-600 mt-4">This is a Computer Generated Document</div>
      </div>
    </div>
  )
}
