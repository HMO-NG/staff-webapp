import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import { useState } from 'react'
import { HiOutlineCloudUpload } from 'react-icons/hi'
import { FcImageFile } from 'react-icons/fc'
import * as XLSX from 'xlsx'
import useNhia from '@/utils/customAuth/useNhisAuth'
import { useLocalStorage } from '@/utils/localStorage'


function viewService() {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleFileUpload = async () => {
        const { useCreateNhiaService, useCreateNhiaServiceBulkUpload } = useNhia()

        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target?.result;
            if (data) {
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);

                console.log(jsonData)

                await useCreateNhiaServiceBulkUpload(jsonData)

            }
        };
        reader.readAsBinaryString(file);
    };

    return (
        <div>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>
        </div>
    );
};

export default viewService;


//------------------
// function viewService() {

//     const [parsedData, setParsedData] = useState([]);

//     const handleFileUpload = (e) => {
//       const file = e.target.files[0];
//       const reader = new FileReader();

//       reader.onload = (event) => {
//         const binaryStr = event.target.result;
//         const workbook = XLSX.read(binaryStr, { type: 'binary' });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//         setParsedData(data);
//         console.log(data)
//       };

//       reader.readAsBinaryString(file);
//     };

//     return (
//       <div>
//         <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
//         {/* {parsedData.length > 0 && (
//           <table>
//             <thead>
//               <tr>
//                 {parsedData[0].map((header, index) => (
//                   <th key={index}>{header}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {parsedData.slice(1).map((row, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {row.map((cell, cellIndex) => (
//                     <td key={cellIndex}>{cell}</td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )} */}
//       </div>
//     );
//   }

// export default viewService;