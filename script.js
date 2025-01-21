
const subjectData = {
    "Math Add": 12,
    "Physic": 12,
    "Chemi": 12,
    "Bio": 12,
    "Sci Exp": 12,
    "Thai Main": 8,
    "Math Main": 8,
    "Social": 8,
    "Eng Main": 8,
    "Eng Add": 8,
    "History": 4,
    "Com": 4,
    "Thai Add": 4,
    "Astro": 4,
    "Law": 4,
    "Math Exp": 4,
    "Esc": 4,
};


const dailySchedule = {
    "Monday": { "Physic": 2, "Bio": 1, "Social": 1, "Eng Main": 1, "Eng Add": 1, "History": 1 },
    "Tuesday": { "Math Exp": 1, "Sci Exp": 2, "Eng Add": 1, "Com": 1, "Math Add": 2 },
    "Wednesday": { "Thai Main": 1, "History": 1, "Eng Main": 1, "Math Main": 1, "Law": 1, "Thai Add": 1, "Esc": 1 },
    "Thursday": { "Thai Main": 1, "Bio": 1, "Eng Main": 2, "Physic": 1, "Social": 1, "Math Add": 1 },
    "Friday": { "Math Exp": 1, "Physic": 1, "Chemi": 1, "Bio": 1, "Eng Main": 2, "Astro": 1 },
};

// คำนวณการลา
document.getElementById("calculate-btn").addEventListener("click", function () {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const totalAbsence = {};
    let overLimitSubjects = [];
    let allSubjectsOnTrack = true; // เช็คเวลาเรียนครบบ่

    // คำนวณจำนวนวันลา
    days.forEach(day => {
        const daysAbsence = parseInt(document.getElementById(day.toLowerCase()).value, 10) || 0;
        const schedule = dailySchedule[day];

        for (const subject in schedule) {
            if (!totalAbsence[subject]) totalAbsence[subject] = 0;
            totalAbsence[subject] += daysAbsence * schedule[subject];
        }
    });

    // result table
    const resultDiv = document.getElementById("subject-data");
    resultDiv.innerHTML = "";

    // สร้างตาราง
    let table = `
        <table>
            <thead>
                <tr>
                    <th>วิชา</th>
                    <th>จำนวนวันที่ลา</th>
                    <th>เหลือวันที่ลา</th>
                </tr>
            </thead>
            <tbody>
    `;

    // เพิ่มข้อมูลลงตาราง
    for (const subject in totalAbsence) {
        const maxAbsence = subjectData[subject] || 0;
        const usedAbsence = totalAbsence[subject];
        let remaining = maxAbsence - usedAbsence;

        // ถ้าจำนวนวันที่ลามาก จะเป็นค่า-
        const remainingDisplay = remaining >= 0 ? remaining : `<span class="highlight">${remaining}</span>`;

        // ถ้าลาเกินจะเก็บวิชานั้นไว้ในอาเรย์
        if (remaining <= 0) {
            overLimitSubjects.push({ subject, remaining });
            allSubjectsOnTrack = false; // ถ้ามีวิชาที่ลาเกินให้เปลี่ยนเป็น false
        }

        table += `
            <tr class="${remaining < 0 ? 'over-limit' : ''}">
                <td>${subject}</td>
                <td>${usedAbsence}</td>
                <td>${remainingDisplay}</td>
            </tr>
        `;
    }

    table += `</tbody></table>`;

    // ใส่ตารางใน div result
    resultDiv.innerHTML = table;

    // เตือนลาเกิน
    if (overLimitSubjects.length >= 0) {
        let summary = `<div class="summary"><h3>สรุปการลาเกิน:</h3><ul>`;
        overLimitSubjects.forEach(item => {
            const daysForSubject = Object.keys(dailySchedule).filter(day => dailySchedule[day][item.subject]);
            const overLimitDays = Math.abs(item.remaining);
            summary += `
                <li><strong>${item.subject}</strong>: ลาเกิน ${overLimitDays} วัน<br>
                ห้ามลาวัน: <span class="highlight-days">${daysForSubject.join(", ")}</span></li>
            `;
        });
        summary += "</ul></div>";
        resultDiv.innerHTML += summary;
    } else {
        // ถ้าทุกวิชาลาไม่เกิน
        resultDiv.innerHTML += `<div class="summary"><h3>เวลาเรียนครบ มั้ง😗</h3></div>`;
    }
});
