import jsPDF from "jspdf"
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

    // const doc = new jsPDF()
    
    // doc.setFont("helvetica", "bold")
    // doc.text(70, 20, "AGREEMENT OF SALE")
    // doc.setFont("helvetica", "normal")
    // doc.setFontSize(10)
    // doc.text(10, 30, `This AGREEMENT TO SALE is made here at [City], on this day of ${currentDate}.`)
    // doc.setFont("helvetica", "bold")
    // doc.text(100, 40, "BETWEEN")
    // doc.setFont("helvetica", "normal")

    // doc.text(10, 50, `Mr. / Mrs. ______${seller.firstName}_______ /o. ______${seller.lastName}______.`)
    // doc.text(10, 55, `Muslim, adult, holding CNIC No. _____${seller.cnic}_____ Resident of ______________________________________`)
    // doc.text(10, 60, "____________ [City], hereinafter called the SELLER of the ONE PART.")

    // doc.setFont("helvetica", "bold")

    // doc.text(105, 70, "A N D")

    // doc.setFont("helvetica", "normal")

    // doc.text(10, 80, `Mr. / Mrs. _____${buyer.firstName}______ /o. _____${buyer.lastName}_____`)
    // doc.text(10, 85, `Muslim, adult, holding CNIC No. ____${buyer.cnic}____ Resident of _______________________________________`)
    // doc.text(10, 90, "[City], hereinafter referred to as the PURCHASER of the OTHER PART [all the ")
    // doc.text(10, 95, "expression wherever context so permits shall mean and include their respective,heirs, executors administrators,")
    // doc.text(10, 100, " successors, assignors and the attorneys etc.]")

    // doc.text(10, 110, "WHEREAS the SELLER above-named has seized, possessed of and otherwise well and sufficiently entitled in respect")
    // doc.text(10, 115, "of ____________________________________________________________________. ")


    // doc.text(20, 130, `${status === "Save" ? seller.address : ''}                ${status === "Save" ? buyer.address : ''}`)
    // doc.setFont("helvetica", "bold")
    // doc.text(60, 135, "SELLER                                                                          BUYER")

    // doc.setFont("helvetica", "normal")

    // doc.text(10, 160, "WHEREAS the SELLER agreed to sell/assign and the PURCHASER has agreed to purchase/acquire the said property")
    // doc.text(10, 165, `absolutely and forever, against a lump sum sale consideration of Rs. __${transaction.accepted_price}__ .`)

    // window.open(doc.output("bloburl"), "_blank")
}

export default generatePDF