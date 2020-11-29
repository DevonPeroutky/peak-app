import React from "react";
import cn from "classnames";
import {Divider, message, Popconfirm, Select} from "antd";
import {CodeOutlined, CodeTwoTone, DeleteOutlined, QuestionCircleOutlined} from "@ant-design/icons/lib";
import {capitalize} from "lodash";
const { Option } = Select;

interface LanguageSelectProps {
    codeId: string,
    updateLanguage: (newLanguage: string) => void,
    isEditing: boolean,
    language: string,
    pageId: string
    deleteCodeBlock: (e: any) => void
}

export function LanguageContextBar(props: LanguageSelectProps) {
    const { updateLanguage, language, isEditing, deleteCodeBlock } = props
    return (
        <div className={cn("code-metadata-overlay")}>
            { (isEditing) ?
                <>
                    <Select
                        defaultValue={capitalize(language)}
                        suffixIcon={null}
                        className={"peak-language-select"}
                        dropdownMatchSelectWidth={120}
                        onChange={(language: string) => {
                            updateLanguage(language)
                        }}>
                        <Option value="javascript">Javascript</Option>
                        <Option value="java">Java</Option>
                        <Option value="scala">Scala</Option>
                        <Option value="python">Python</Option>
                        <Option value="batchfile">Batchfile</Option>
                        <Option value="typescript">Typescript</Option>
                        <Option value="sass">Sass</Option>
                        <Option value="ruby">Ruby</Option>
                        <Option value="css">Css</Option>
                        <Option value="xml">Xml</Option>
                        <Option value="mysql">Mysql</Option>
                        <Option value="json">Json</Option>
                        <Option value="html">Html</Option>
                        <Option value="handlebars">Handlebars</Option>
                        <Option value="golang">Golang</Option>
                        <Option value="csharp">Csharp</Option>
                        <Option value="elixir">Elixir</Option>
                    </Select>
                    <div className={"delete-code-block-icon"}>
                        <Popconfirm title="Are you sure？" icon={<QuestionCircleOutlined style={{ color: 'red' }} />} onConfirm={deleteCodeBlock}>
                            <DeleteOutlined />
                        </Popconfirm>
                    </div>
                </> : <>
                    <CodeOutlined />
                    <span className={"chosen-language"}>{capitalize(language)}</span>
                </>
            }
        </div>
    )
}