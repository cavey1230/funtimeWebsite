import React, {
    Component,
    ReactElement,
    createRef,
    ComponentClass
} from "react";

interface Props {
    onFinish?: (value: any) => void
    //如果数据为异步，需要指定reload的值
    reload?: Array<any>
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
    reload?: Array<any>
}

interface FormItemState {
    value: string
    warningMessage: Array<{ message: string, target: string }>
    showWarn: boolean
    itemArr: any[]
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
    public containerRef: React.RefObject<HTMLDivElement>

    constructor(props: Props) {
        super(props);
        this.state = {
            itemRefObject: {},
            itemArr: [],
        }
        this.containerRef = createRef()
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

    submit = () => {
        const warnMessageArrLengthArr = Object.keys(this.state.itemRefObject).map((item) => {
            // console.log(this.state.itemRefObject[item].state.warningMessage)
            const itemRef = this.state.itemRefObject[item]
            itemRef.showWarnControl(true)
            return itemRef.state.warningMessage.length
        })
        // 查看错误条数
        // console.log(warnMessageArrLengthArr)
        if (warnMessageArrLengthArr.filter(i => i).length > 0) {
            return {warning: true}
        }
        const innerObj = this.getFormField()
        return {...innerObj, warning: false}
    }

    // 接管 button 点击事件
    secondDepthCloneElementFunc = (child: React.ReactNode) => {
        return React.cloneElement(child as ReactElement, {
            children: React.cloneElement((child as any).props.children,
                {
                    onClick: () => {
                        this.props.onFinish(this.submit())
                    }
                })
        })
    }

    loadChildren = () => {
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

    componentDidMount() {
        this.loadChildren()
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.reload !== this.props.reload) {
            this.loadChildren()
        }
    }

    render() {
        return (
            <div
                ref={this.containerRef}
                style={{display: "flex", flexDirection: "column"}}
            >
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
            warningMessage: [],
            showWarn: false,
            itemArr: []
        }
        this.inputRef = createRef()
    }

    public showWarnControl = (bool: boolean) => {
        this.setState(() => {
            return {showWarn: bool}
        })
    }

    public resetValue = () => {
        this.setState({
            value: ""
        }, () => {
            (this.inputRef.current as any).setValue("")
        })
    }

    private verifyObject: { [key: string]: Function } = {
        required: (innerValue: boolean, tips: string, value: string | object) => {
            const result = typeof value === "object" ? Object.keys(value).length : value?.length
            return !(result > 0) && {message: tips, target: "requiredWarnTarget"}
        },
        max: (innerValue: number, tips: string, value: string) => {
            return ((value as string).length > innerValue) && {message: tips, target: "maxWarnTarget"}
        },
        min: (innerValue: number, tips: string, value: string) => {
            return ((value as string).length < innerValue) && {message: tips, target: "minWarnTarget"}
        },
        email: (innerValue: number, tips: string, value: string) => {
            const regExp =  new RegExp("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9]{2,6}$")
            return (!((value as string).match(regExp))) && {message: tips, target: "emailWarnTarget"}
        },
        length: (innerValue: number, tips: string, value: string) => {
            return ((value as string).length !== innerValue) && {message: tips, target: "lengthWarnTarget"}
        },
        password: (innerValue: [number, number], tips: string, value: string) => {
            const [min, max] = innerValue as [number, number]
            const regExp = new RegExp(`[a-z1-9A-Z]{${min},${max}}`)
            const matchArray = (value as string).match(regExp)
            return !matchArray && {message: tips, target: "passwordWarnTarget"}
        },
    }

    private verifyFunc = (value: string | Array<any> | object) => {
        const {condition} = this.props
        const innerMessage = condition ? Object.keys(condition).map((item) => {
            type itemKey = keyof verifyCondition
            const innerValue = condition[item as itemKey]["value"]
            const innerTips = condition[item as itemKey]["tips"]
            return innerValue && this.verifyObject[item](innerValue, innerTips, value)
        }).filter(i => i) : []
        this.setState({
            warningMessage: innerMessage
        })
    }

    private loadChildren = () => {
        const {children} = this.props
        const childrenComponent = React.Children.map(children, (child, index) => {
            const typeofChildrenOfChild = (child as ReactElement).props.type
            const afterClone = React.cloneElement(child as ReactElement, {
                ref: this.inputRef,
                onChange: (str: string) => {
                    this.setState({
                        value: str
                    }, () => {
                        this.verifyFunc(str)
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
        this.setState({
            ...this.state,
            itemArr: childrenComponent
        })
    }

    componentDidMount() {
        this.loadChildren()
    }

    componentDidUpdate(prevProps: Readonly<Props>) {
        if (prevProps.reload !== this.props.reload) {
            this.loadChildren()
        }
    }

    render() {
        const {style} = this.props

        const {value, showWarn, itemArr} = this.state

        const valueLength = typeof value === "object" ? Object.keys(value).length : value?.length

        return (
            <div style={{...style}}>
                {itemArr}
                {this.state.warningMessage.length > 0 && (valueLength > 0 || showWarn) && <div>
                    {this.state.warningMessage.map((item, index) => {
                        return <div
                            style={{
                                width: "100%",
                                textAlign: "center",
                                color: "red",
                                padding: "1rem",
                                boxSizing: "border-box",
                                backgroundColor: "var(--border-color)"
                            }}
                            key={`${item.target}_${index}`}
                        >
                            {item.message}
                        </div>
                    })}
                </div>}
            </div>
        );
    }
}
