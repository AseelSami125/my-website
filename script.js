  // --------------------------
// تسجيل دخول الصيدلية
// --------------------------
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    let pharmacies = JSON.parse(localStorage.getItem("pharmacies")) || [];
    let pharmacy = pharmacies.find(p => p.name === username && p.password === password);

    if(pharmacy){
        localStorage.setItem("currentPharmacy", JSON.stringify(pharmacy));
        window.location.href = "dashboard.html";
    } else {
        alert("اسم الصيدلية أو كلمة المرور خاطئة");
    }
}

// --------------------------
// تحميل بيانات الصيدلية في لوحة التحكم
// --------------------------
function loadPharmacyData(){
    const pharmacy = JSON.parse(localStorage.getItem("currentPharmacy"));
    if(pharmacy){
        document.getElementById("pharmacyName").value = pharmacy.name;
        document.getElementById("pharmacyAddress").value = pharmacy.address;
        document.getElementById("pharmacyPhone").value = pharmacy.phone;
    } else {
        alert("لا يوجد صيدلية حالية");
        window.location.href = "login.html";
    }
}

// --------------------------
// إدارة الأدوية
// --------------------------
function saveMedicine(){
    const name = document.getElementById("medicineName").value;
    const price = document.getElementById("medicinePrice").value;
    const expiry = document.getElementById("expiryDate").value;
    const editIndex = document.getElementById("editIndex").value;

    let pharmacy = JSON.parse(localStorage.getItem("currentPharmacy"));
    pharmacy.medicines = pharmacy.medicines || [];

    if(editIndex){
        pharmacy.medicines[editIndex] = {name, price, expiry};
    } else {
        pharmacy.medicines.push({name, price, expiry});
    }

    updatePharmacyInStorage(pharmacy);
    displayMedicines();
    clearMedicineForm();
}

function displayMedicines(){
    const table = document.getElementById("medicineTable");
    const pharmacy = JSON.parse(localStorage.getItem("currentPharmacy"));
    table.innerHTML = "";
    pharmacy.medicines.forEach((med, index)=>{
        table.innerHTML += `
        <tr>
            <td>${med.name}</td>
            <td>${med.price}</td>
            <td>${med.expiry}</td>
            <td>
                <button onclick="editMedicine(${index})">تعديل</button>
                <button onclick="deleteMedicine(${index})">حذف</button>
            </td>
        </tr>`;
    });
}

function editMedicine(index){
    const pharmacy = JSON.parse(localStorage.getItem("currentPharmacy"));
    const med = pharmacy.medicines[index];
    document.getElementById("medicineName").value = med.name;
    document.getElementById("medicinePrice").value = med.price;
    document.getElementById("expiryDate").value = med.expiry;
    document.getElementById("editIndex").value = index;
}

function deleteMedicine(index){
    const pharmacy = JSON.parse(localStorage.getItem("currentPharmacy"));
    pharmacy.medicines.splice(index,1);
    updatePharmacyInStorage(pharmacy);
    displayMedicines();
}

function clearMedicineForm(){
    document.getElementById("medicineName").value = "";
    document.getElementById("medicinePrice").value = "";
    document.getElementById("expiryDate").value = "";
    document.getElementById("editIndex").value = "";
}

// --------------------------
// تحديث الصيدلية في localStorage
// --------------------------
function updatePharmacyInStorage(pharmacy){
    let pharmacies = JSON.parse(localStorage.getItem("pharmacies")) || [];
    const index = pharmacies.findIndex(p => p.name === pharmacy.name);
    if(index > -1){
        pharmacies[index] = pharmacy;
    } else {
        pharmacies.push(pharmacy);
    }
    localStorage.setItem("pharmacies", JSON.stringify(pharmacies));
    localStorage.setItem("currentPharmacy", JSON.stringify(pharmacy));
}

// --------------------------
// صفحة البحث للمستخدم
// --------------------------
function displayMedicinesGlobal(){
    const pharmacies = JSON.parse(localStorage.getItem("pharmacies")) || [];
    const table = document.getElementById("globalMedicineTable");
    table.innerHTML = "";

    pharmacies.forEach(p => {
        (p.medicines || []).forEach(med => {
            table.innerHTML += `
            <tr>
                <td>${med.name}</td>
                <td>${med.price}</td>
                <td>${med.expiry}</td>
                <td>${p.name}</td>
                <td>${p.address}</td>
                <td>${p.phone}</td>
            </tr>`;
        });
    });
}

function searchMedicineGlobal(){
    const input = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.getElementById("globalMedicineTable").getElementsByTagName("tr");

    for(let i=0;i<rows.length;i++){
        let medName = rows[i].getElementsByTagName("td")[0].innerText.toLowerCase();
        rows[i].style.display = medName.includes(input) ? "" : "none";
    }
}

  
  // --------------------------
// تسجيل صيدلية جديدة
// --------------------------
function registerPharmacy(){
    const name = document.getElementById("regName").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const address = document.getElementById("regAddress").value.trim();
    const phone = document.getElementById("regPhone").value.trim();

    if(!name || !password || !address || !phone){
        alert("يرجى ملء جميع الحقول!");
        return;
    }

    let pharmacies = JSON.parse(localStorage.getItem("pharmacies")) || [];
    if(pharmacies.find(p => p.name === name)){
        alert("اسم الصيدلية موجود بالفعل!");
        return;
    }

    const newPharmacy = {
        name: name,
        password: password,
        address: address,
        phone: phone,
        medicines: []
    };

    pharmacies.push(newPharmacy);
    localStorage.setItem("pharmacies", JSON.stringify(pharmacies));
    alert("تم تسجيل الصيدلية بنجاح! يمكنك الآن تسجيل الدخول.");
    
    // مسح الحقول
    document.getElementById("regName").value = "";
    document.getElementById("regPassword").value = "";
    document.getElementById("regAddress").value = "";
    document.getElementById("regPhone").value = "";
}
