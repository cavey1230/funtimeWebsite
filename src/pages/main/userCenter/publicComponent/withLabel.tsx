import classnames from '@/utils/classnames';
import React, {CSSProperties, forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';

import "./withLabel.less";

interface Props {
    label: string
    onChange?: (str: string) => void
    expandClassName?: string
    formItemModel?: boolean
    alignItems?: CSSProperties["alignItems"]
}

const WithLabel: React.FC<Props & React.RefAttributes<any>> = forwardRef((
    props, ref
) => {
    const {
        label, children, onChange,
        expandClassName, formItemModel, alignItems
    } = props

    const childRef = useRef(null)

    const [value, setValue] = useState("" as any)

    useEffect(() => {
        onChange && onChange(value)
    }, [value])

    useImperativeHandle(ref, () => ({
        setValue: (str: string) => {
            setValue("")
            childRef.current.setValue("")
        }, value
    }))

    return (
        <div className="with-label-container">
            <div>
                {label}
            </div>
            <div
                className={classnames("with-content-item", expandClassName)}
                style={{alignItems}}
            >
                {formItemModel ? React.Children.map(children, (item) => {
                    return React.cloneElement(item as JSX.Element, {
                        ref: childRef,
                        onChange: (result: any) => {
                            setValue(result)
                        }
                    })
                }) : children}
            </div>
        </div>
    );
})

export default WithLabel;