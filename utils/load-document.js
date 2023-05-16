import { PDFDocument, rgb , StandardFonts } from "pdf-lib"

const generatePDF = async (seller, buyer, transaction, currentDate, status) => {

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage()

    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  
    page.setFont(helveticaBoldFont)
    page.setFontSize(18)
  
    page.drawText('AGREEMENT OF SALE', {
      x: 200,
      y: 750,
    })
    const text = `

    This AGREEMENT TO SALE is made here at [City], on this day of ${currentDate}.
                                                                           BETWEEN
    Mr. / Mrs. ${seller.firstName} /o. ${seller.lastName}.
    Muslim, adult, holding CNIC No. ${seller.cnic} Resident of ______________________________________
    ____________ [City], hereinafter called the SELLER of the ONE PART.
  
                                                                             AND
  
    Mr. / Mrs. ${buyer.firstName} /o. ${buyer.lastName}
    Muslim, adult, holding CNIC No. ${buyer.cnic} Resident of _______________________________________
    [City], hereinafter referred to as the PURCHASER of the OTHER PART [all the expression wherever
    context so permits shall mean and include their respective,heirs, executors administrators,
    successors, assignors and the attorneys etc.]
  
    WHEREAS the SELLER above-named has seized, possessed of and otherwise well and sufficiently 
    entitled in respect of _______________________________________________________________.
  
  
  
                                SELLER                                                                                    BUYER
    ${status === "Save" ? seller.address : ''}     ${status === "Save" ? buyer.address : ''}

    WHEREAS the SELLER agreed to sell/assign and the PURCHASER has agreed to purchase/acquire
    the said property absolutely and forever, against a lump sum sale consideration of Rs. ${transaction.accepted_price}.`;
  

    const font = await pdfDoc.embedFont('Helvetica')
    page.setFont(font)
    page.setFontSize(12)
    page.drawText(text, {
        x: 10,
        y: 750,
        size: 12,
        color: rgb(0, 0, 0)
    })
  
    const pdfBytes = await pdfDoc.save()
  
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
  
    window.open(url, '_blank')

}

export default generatePDF