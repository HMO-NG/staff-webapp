import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useHealthPlan from '@/utils/customAuth/useHealthPlanAuth';
import Table from '@/components/ui/Table'
import Tag from '@/components/ui/Tag'


interface HealthPlanCategoryData {
    id: string;
    name: string;
    is_active: boolean;
    health_plan_code: string;
    description: string;
    band: string;
    user_id: string;
    user_email: string;
    user_phone_number: string;
    user_role: string;
    is_user_account_active: boolean;
    user_last_active_at: string;
    entered_by: string;
}

const SingleViewHealthPlanCategory = () => {
    const location = useLocation();
    const { id } = location.state;
    const [healthPlanCategoryData, setHealthPlanCategoryData] = useState<HealthPlanCategoryData[] | null>(null)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { useGetSingleHealthPlanCategoryAuth } = useHealthPlan()

    const { Tr, Th, Td, THead, TBody } = Table



    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await useGetSingleHealthPlanCategoryAuth({ "id": `${id}` })
            if (result?.data) {
                setHealthPlanCategoryData(result?.data)
                console.log('Data fetched:', result.data);
            } else {
                setError('No data received from the API');
            }
        } catch (error) {
            setError('Failed to fetch health plan category data');
            console.error(error);
        } finally {
            setIsLoading(false);

        }

    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData])

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!healthPlanCategoryData) return <div>No data available</div>;

    return (

        // id
        // :
        // "39a8fc05-3b47-4d21-aa6f-56b8562d7062"

        // is_user_account_active
        // :
        // 0
        // user_email
        // user_id
        // :
        // "0aa468ea-bee8-4475-9e99-334f9dededf2"
        // user_last_active_at
        // :
        // "2024-06-25T18:41:31.000Z"


        <>
            <div>
                <Table>
                    <THead>
                        <Tr>
                            <Th>Details</Th>
                            <Th>Values</Th>
                        </Tr>
                    </THead>
                    <TBody>
                        <Tr>
                            <Td>Health Plan Category Name</Td>
                            <Td>{healthPlanCategoryData[0].name}</Td>
                        </Tr>
                        <Tr>
                            <Td>Health Plan Category Band</Td>
                            <Td>{healthPlanCategoryData[0].band}</Td>
                        </Tr>
                        <Tr>
                            <Td>Health Plan Category Code</Td>
                            <Td>{healthPlanCategoryData[0].health_plan_code}</Td>
                        </Tr>
                        <Tr>
                            <Td>Health Plan Category Description</Td>
                            <Td>{healthPlanCategoryData[0].description}</Td>
                        </Tr>
                        <Tr>
                            <Td>Is Health Plan Category Active?</Td>
                            <Td>{healthPlanCategoryData[0].is_active ? <Tag className='text-white bg-indigo-600 border-0'>Active</Tag> : <Tag className='text-white bg-red-700 border-0'>InActive</Tag>}</Td>
                        </Tr>

                        <Tr>

                        </Tr>
                        <Tr>
                            <Td style={{ color: 'red', fontWeight: 'bold' }}> User Information </Td>
                        </Tr>
                        <Tr>

                        </Tr>
                        <Tr>
                            <Td>Entered by</Td>
                            <Td>{healthPlanCategoryData[0].entered_by}</Td>
                        </Tr>
                        <Tr>
                            <Td> User Email</Td>
                            <Td>{healthPlanCategoryData[0].user_email}</Td>
                        </Tr>
                        <Tr>
                            <Td> Is User Account Active?</Td>
                            <Td>{healthPlanCategoryData[0].is_user_account_active ? <Tag className='text-white bg-indigo-600 border-0'>Active</Tag> : <Tag className='text-white bg-red-700 border-0'>InActive</Tag>}</Td>
                        </Tr>
                        <Tr>
                            <Td> User Role</Td>
                            <Td>{healthPlanCategoryData[0].user_role}</Td>
                        </Tr>
                        <Tr>
                            <Td> User Phone Number</Td>
                            <Td>{healthPlanCategoryData[0].user_phone_number}</Td>
                        </Tr>
                        <Tr>
                            <Td> User Last Active</Td>
                            <Td>{healthPlanCategoryData[0].user_last_active_at}</Td>
                        </Tr>
                    </TBody>
                </Table>
            </div>
        </>

    );

}

export default SingleViewHealthPlanCategory