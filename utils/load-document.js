import jsPDF from "jspdf"

const generatePDF = (seller, buyer, transaction, currentDate, status) => {

    const doc = new jsPDF()
    
    doc.setFont("helvetica", "bold")
    doc.text(70, 20, "AGREEMENT OF SALE")
    doc.setFont("helvetica", "normal")
    doc.setFontSize(10)
    doc.text(10, 30, `This AGREEMENT TO SALE is made here at [City], on this day of ${currentDate}.`)
    doc.setFont("helvetica", "bold")
    doc.text(100, 40, "BETWEEN")
    doc.setFont("helvetica", "normal")

    doc.text(10, 50, `Mr. / Mrs. ______${seller.firstName}_______ /o. ______${seller.lastName}______.`)
    doc.text(10, 55, `Muslim, adult, holding CNIC No. _____${seller.cnic}_____ Resident of ______________________________________`)
    doc.text(10, 60, "____________ [City], hereinafter called the SELLER of the ONE PART.")

    doc.setFont("helvetica", "bold")

    doc.text(105, 70, "A N D")

    doc.setFont("helvetica", "normal")

    doc.text(10, 80, `Mr. / Mrs. _____${buyer.firstName}______ /o. _____${buyer.lastName}_____`)
    doc.text(10, 85, `Muslim, adult, holding CNIC No. ____${buyer.cnic}____ Resident of _______________________________________`)
    doc.text(10, 90, "[City], hereinafter referred to as the PURCHASER of the OTHER PART [all the ")
    doc.text(10, 95, "expression wherever context so permits shall mean and include their respective,heirs, executors administrators,")
    doc.text(10, 100, " successors, assignors and the attorneys etc.]")

    doc.text(10, 110, "WHEREAS the SELLER above-named has seized, possessed of and otherwise well and sufficiently entitled in respect")
    doc.text(10, 115, "of ____________________________________________________________________. ")


    doc.text(20, 130, `${status === "Save" ? seller.address : ''}                ${status === "Save" ? buyer.address : ''}`)
    doc.setFont("helvetica", "bold")
    doc.text(60, 135, "SELLER                                                                          BUYER")

    doc.setFont("helvetica", "normal")

    doc.text(10, 160, "WHEREAS the SELLER agreed to sell/assign and the PURCHASER has agreed to purchase/acquire the said property")
    doc.text(10, 165, `absolutely and forever, against a lump sum sale consideration of Rs. __${transaction.accepted_price}__ .`)

    // doc.addPage()

    // doc.setFont("helvetica", "bold")
    // doc.text(10, 35, "THE OTHER TERMS AND CONDITIONS ARE AS UNDER:-")
    // doc.setFont("helvetica", "normal")
    // doc.text(10, 40, "1. That in pursuance of above contract the SELLER has received a sum of Rs.________________ (Rupees _________________")
    // doc.text(10, 45, "only). The Payment Schedule is as under:-")
    // doc.text(10, 50, "a. Rs. _______________/- (Rupees ________________________________________ only) in Cash/vide Cheque /Pay ")
    // doc.text(10, 65, "Order No. ___________________ Dated ____________,Drawn on ______________________________________. ")


    // doc.text(10, 70, "b. Rs. _______________/- (Rupees _______________________________________ only) in Cash/vide Cheque /Pay Order ")
    // doc.text(10, 75, "No. ______________________ Dated ________________, Drawn on ________________________________________________.")

    // doc.text(10, 85, "c. Rs. _______________/- (Rupees _______________________________________ only) in Cash/vide Cheque /Pay Order")
    // doc.text(10, 90, " No. ______________________ Dated ________________, Drawn on ____________________________________, from")
    // doc.text(10, 95, "the above named PURCHASER being the PART PAYMENT, towards the total sale consideration.Receipt whereof")
    // doc.text(10, 100, "the SELLER has fully admitted & acknowledged.")

    // doc.text(10, 110, "2. That rest / balance sales consideration of Rs. ________________ (Rupees ____________________ only)")
    // doc.text(10, 115, "shall be paid by the PURCHASER to the SELLEER on or before __________________ at the time of handing")
    // doc.text(10, 120, "over possession of the said property with complete original documents and execution of SALE DEED/TRANSFER")
    // doc.text(10, 125, "DEED in the name of PURHCASER or his/her nominee(s).")

    // doc.text(10, 135, "3. The upon satisfactory receipt of full & final sale consideration, the SELLER will cease, surrender and withdraw ")
    // doc.text(10, 140, "all his rights, titlements, claims in respect of the said property in favour of PURCHASER or his / her nominee(s).")

    // doc.text(10, 150, "4. That the SELLER above named shall sign and execute all the requisite documents and papers as and when ")
    // doc.text(10, 155, "called for to do so in respect of the said property without any cost and hindrance.")

    // doc.text(10, 165, "5. That the Seller will pay the ____________% commission to his/her Agent(s) i.e.___________________________")
    // doc.text(10, 170, "as per agreed terms.")

    // doc.text(10, 180, "6. That the Purchaser will pay the ____________% commission to his/her Agent(s) i.e. _______________________")
    // doc.text(10, 185, "as per agreed terms.")

    // doc.text(10, 195, "7. That the SELLER has not taken any loan from HBFCL or Co-operative Society /Bank payable immediately")
    // doc.text(10, 200, "or any future date (re payment of loan) AMENDED ACT 1966.")


    // doc.text(50, 225, "__________________________                  __________________________")
    // doc.setFont("helvetica", "bold")
    // doc.text(60, 230, "           SELLER                                                    BUYER")
    // doc.setFont("helvetica", "normal")


    // doc.text(10, 235, "8. That the SELLER hereby covenant that he is the rightful, legal and legitimate owner of the said property")
    // doc.text(10, 240, "having clear and valid title in his / her name and further undertake to indemnify the said PURCHASER against")
    // doc.text(10, 245, "all losses or damages if caused due to any misstatement, defect in the title or concealment of facts or due")
    // doc.text(10, 250, "to SELLER non-compliance to the terms of this agreement.")

    // doc.text(10, 260, "9. That the said property is free from all sorts of claims, encumbrances, mortgages,liens, rights, burdens,")
    // doc.text(10, 265, " dues or litigations.")

    // doc.text(10, 275, "10. That the SELLER above named shall not enter into an agreement or negotiation of any nature in respect of")
    // doc.text(10, 280, "the said property after signing this agreement.If the SELLER will fail to transfer the property in time,he/she will")
    // doc.text(10, 285, "pay the double of the advance amount to the PURCHASER and if PURCHASER fails to pay the balance Sale Consideration")
    // doc.text(10, 290, "in time to the SELLER, the advance paid will be forfeited and sale agreement will be treated as canceled.")
    // doc.addPage();

    // doc.text(10, 20, "11. That the outstanding of any nature of Dues / Taxes, Property Tax, Electricity, Gas,Telephone, Water & Sewerage,")
    // doc.text(10, 25, "Maintenance Charges, Union Charges etc. Whatsoever will be paid and cleared by the SELLER himself/herself upto the")
    // doc.text(10, 30, "date of possession/transfer or sale deed in all respects.")

    window.open(doc.output("bloburl"), "_blank")
}

export default generatePDF