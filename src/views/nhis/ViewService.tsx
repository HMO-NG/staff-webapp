import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import { HiOutlineCloudUpload } from 'react-icons/hi'
import { FcImageFile } from 'react-icons/fc'

function viewService() {
    const tip = <p className="mt-2">import excel or csv only</p>

    const beforeUpload = (files: FileList | null, fileList: File[]) => {
        console.log(fileList)
        return true
    }

    return (
        <>
            <div className="mb-4">
                <Upload
                    tip={tip}
                    accept='XLSX'
                    showList={false}
                    beforeUpload={beforeUpload}>
                    <Button variant="solid" icon={<HiOutlineCloudUpload />}>
                        Upload your file
                    </Button>
                </Upload>
            </div>
        </>
    )
}

export default viewService;