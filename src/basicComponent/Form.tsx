import React, {
    Component,
    ReactElement,
    createRef,
    ComponentClass
} from "react";

interface Props {
    onFinish: (value: any) => void
}

interface State {
    itemRefObject: { [key: string]: any }
    itemArr: any[]
}

interface FormItemProps {
    name: string
    label: string
    // Partial 返回一个所有 字段都可选的新接口类型
    condition: Partial<verifyCondition>
    style: object
}

interface FormItemState {
    value: string
    warningMessage: Array<{ message: string, target: string }>
}

interface verifyCondition {
    required: { value: boolean, tips: string },
    max: { value: number, tips: string },
    min: { value: number, tips: string },
    length: { value: number, tips: string },
    email: { value: string, tips: string },
    password: { value: Array<number>, tips: string },
}

export class Form extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            itemRefObject: {},
            itemArr: [],
        }
    }

    resetField = () => {
        const innerItemRefObject = this.state.itemRefObject
        Object.keys(innerItemRefObject).map(item => {
            // console.log(innerItemRefObject[item])
            innerItemRefObject[item].resetValue()
        })
    }

    getFormField = () => {
        const innerObj: { [key: string]: string } = {}
        Object.keys(this.state.itemRefObject).forEach((item) => {
            // console.log(this.state.itemRefObject[item].state.value)
            innerObj[item] = this.state.itemRefObject[item].state.value
        })
        return innerObj
    }

    // 接管 button 点击事件
    secondDepthCloneElementFunc = (child: React.ReactNode) => {
        return React.cloneElement(child as ReactElement, {
            children: React.cloneElement((child as any).props.children,
                {
                    onClick: () => {
                        const warnMessageArrLengthArr: number[] = []
                        Object.keys(this.state.itemRefObject).forEach((item) => {
                            // console.log(this.state.itemRefObject[item].state.warningMessage)
                            const innerLength = this.state.itemRefObject[item].state.warningMessage.length
                            warnMessageArrLengthArr.push(innerLength)
                        })
                        // console.log(warnMessageArrLengthArr)
                        if (warnMessageArrLengthArr.filter(i => i).length > 0) {
                            this.props.onFinish({warning: true})
                            return
                        }
                        const innerObj = this.getFormField()
                        this.props.onFinish({...innerObj, warning: false})
                    }
                })
        })
    }

    componentDidMount() {
        const itemRefObject: State["itemRefObject"] = {}
        const itemArr = React.Children.map(this.props.children, (child, index) => {
            const innerName = (child as ReactElement).props.name
            const childrenName = ((child as ReactElement).type as ComponentClass).name
            const typeofChildrenOfChild = (child as ReactElement).props.children?.props.type
            // if (childrenName !== "FormItem" && window.location.href === "http://localhost:3000/#/") {
            //     console.error("Form表单下不能包含除FormItem外的子项")
            // } else {
            if (typeofChildrenOfChild === "submit") {
                return this.secondDepthCloneElementFunc(child)
            }
            return React.cloneElement(child as ReactElement, {
                ref: (el: React.Ref<any>) => {
                    itemRefObject[innerName] = el
                }
            })
            // }
        })
        this.setState({
            itemRefObject,
            itemArr
        }, () => {
            // console.log("Form表单第一次挂载的ref对象", itemRefObject)
            // console.log("Form表单第一次挂载的待渲染对象", itemArr)
        })
    }

    render() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                {this.state.itemArr}
            </div>
        );
    }
}

export class FormItem extends Component<Partial<FormItemProps>, FormItemState> {
    private readonly inputRef: React.RefObject<unknown>;

    constructor(props: FormItemProps) {
        super(props);
        this.state = {
            value: "",
            warningMessage: []
        }
        this.inputRef = createRef()
    }

    public resetValue = () => {
        this.setState({
            value: ""
        }, () => {
            (this.inputRef.current as any).setValue("")
        })
    }


    render() {
        const {children, condition, style} = this.props

        const verifyFunc = (value: string) => {
            const innerMessage = condition ? Object.keys(condition).map((item) => {
                const innerValue = (condition as any)[item]["value"]
                const innerTips = (condition as any)[item]["tips"]
                const concatMessageFunc = (message: string, target: string) => {
                    return {message, target}
                }
                if (item === "password" && innerValue) {
                    const [min, max] = innerValue
                    const regExp = new RegExp(`(?=.*[A-Za-z])(?=.*\\d)[a-z1-9A-Z]{${min},${max}}`)
                    const matchArray = value.match(regExp)
                    if (!matchArray) {
                        return concatMessageFunc(innerTips, "passwordWarnTarget")
                    }
                }
                if (item === "required" && innerValue && !(value.length > 0)) {
                    return concatMessageFunc(innerTips, "requiredWarnTarget")
                }
                if (item === "max" && innerValue && value.length > innerValue) {
                    return concatMessageFunc(innerTips, "maxWarnTarget")
                }
                if (item === "min" && innerValue && value.length < innerValue) {
                    return concatMessageFunc(innerTips, "minWarnTarget")
                }
                if (item === "length" && innerValue && value.length !== innerValue) {
                    return concatMessageFunc(innerTips, "lengthWarnTarget")
                }
                if (item === "email" && innerValue) {
                    const regExp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
                    if (!(value.match(regExp))) {
                        return concatMessageFunc(innerTips, "emailWarnTarget")
                    }
                }
            }).filter(i => i) : []
            this.setState({
                warningMessage: innerMessage
            })
        }

        const renderChildren = React.Children.map(children, (child, index) => {
            const typeofChildrenOfChild = (child as ReactElement).props.type
            const afterClone = React.cloneElement(child as ReactElement, {
                ref: this.inputRef,
                onChange: (str: string) => {
                    this.setState({
                        value: str
                    }, () => {
                        verifyFunc(str)
                    })
                }
            })
            if (typeofChildrenOfChild === "submit") {
                return child
            }
            if (typeofChildrenOfChild === "password") {
                return <form>
                    {afterClone}
                </form>
            }
            return afterClone
        })

        return (
            <div style={{...style}}>
                {renderChildren}
                {
                    this.state.warningMessage.length > 0 &&
                    this.state.value.length > 0 && <div>
                        {this.state.warningMessage.map((item, index) => {
                            return <div
                                style={{
                                    width: "100%",
                                    textAlign: "center",
                                    color: "red"
                                }}
                                key={`${item.target}_${index}`}
                            >
                                {item.message}
                            </div>
                        })}
                    </div>
                }
            </div>
        );
    }
}
