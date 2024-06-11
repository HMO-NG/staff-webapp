import { cloneElement } from 'react'
import Avatar from '@/components/ui/Avatar'
import Logo from '@/components/template/Logo'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'

interface SideProps extends CommonProps {
    content?: React.ReactNode
}

const Hmo = ({ children, content, ...rest }: SideProps) => {
    return (
        <div className="grid lg:grid-cols-3 h-full">
            <div
                className="bg-no-repeat bg-cover py-6 px-16 flex-col justify-between hidden lg:flex"
                style={{
                    backgroundImage: `url('/img/others/auth-side-bg.jpg')`,
                }}
            >
                <Logo mode="light" />
                <div>
                    <p className="text-lg text-white opacity-80">
                        HCI Healthcare Limited (formerly known as Healthcare International Limited) is a Health Maintenance Organisation (HMO) incorporated in 1997 and licensed by the National Health Insurance Scheme (NHIS) to provide quality and affordable managed care services to various strata of the Nigerian population. We are owned by some of the leading insurance companies in Nigeria namely: AIICO Insurance Plc, Cosmic Insurance Brokers, Custodian & Allied Insurance Plc, Femi Johnson & Co., Lasaco Assurance Plc, NICON Insurance Corporation, Niger Insurance Plc, and OMIS Investment Ltd.
                    </p>
                </div>

                <span className="text-white">
                    Copyright &copy; {`${new Date().getFullYear()}`}{' '}
                    <span className="font-semibold">{`${APP_NAME}`}</span>{' '}
                </span>
            </div>
            <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
                <div className="xl:min-w-[450px] px-8">
                    <div className="mb-8">{content}</div>
                    {children
                        ? cloneElement(children as React.ReactElement, {
                              ...rest,
                          })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Hmo
