<FieldArray
                                                name="items">
                                                {({ form, remove, push }) => (
                                                    <div>
                                                        {items && items.length > 0
                                                            ? items.map((_, index) => {
                                                                const serviceNameFeedBack =
                                                                    fieldFeedback(
                                                                        form,
                                                                        `items[${index}].service_name`
                                                                    )
                                                                const amountFeedBack =
                                                                    fieldFeedback(
                                                                        form,
                                                                        `items[${index}].amount`
                                                                    )
                                                                const qtyFeedBack =
                                                                fieldFeedback(form,
                                                                    `items[${index}].qty`)

                                                                const amountClaimedFeedBack =
                                                                fieldFeedback(form,
                                                                    `items[${index}].amount_claimed`)

                                                                const amountAgreedFeedBack =
                                                                fieldFeedback(form,
                                                                    `items[${index}].amount_agreed`)

                                                                const amountPaidFeedBack =
                                                                fieldFeedback(form,
                                                                    `items[${index}].amount_paid`)

                                                                return (
                                                                    <div key={index}>
                                                                        {/* benefit names */}
                                                                        <FormItem
                                                                            label="Service Name"
                                                                            invalid={
                                                                                serviceNameFeedBack.invalid
                                                                            }
                                                                            errorMessage={
                                                                                serviceNameFeedBack.errorMessage
                                                                            }
                                                                        >
                                                                            <Field
                                                                                name={`items[${index}].service_name`}
                                                                                placeholder="">
                                                                                {({ field, form }: FieldProps<FormModel>) => (
                                                                                    <Select
                                                                                        field={field}
                                                                                        form={form}
                                                                                        options={selectedBenefitList}
                                                                                        placeholder="select appropriate benefit"
                                                                                        value={selectedBenefitList?.filter(
                                                                                            (items) =>
                                                                                                items.label === _.benefit_name
                                                                                        )}

                                                                                        onChange={(items) => {
                                                                                            form.setFieldValue(
                                                                                                field.name,
                                                                                                items?.label
                                                                                            )

                                                                                            if (items?.value) {

                                                                                                values.benefit_limit[index].benefit_id = items?.value
                                                                                            } else {
                                                                                                values.benefit_limit[index].benefit_id = ''
                                                                                            }

                                                                                        }


                                                                                        }
                                                                                    />
                                                                                )}
                                                                            </Field>
                                                                        </FormItem>

                                                                        {/* the type of limit */}
                                                                        <FormItem
                                                                            label="Limit Type"
                                                                            invalid={
                                                                                amountFeedBack.invalid
                                                                            }
                                                                            errorMessage={
                                                                                amountFeedBack.errorMessage
                                                                            }
                                                                        >
                                                                            <Field
                                                                                name={`benefit_limit[${index}].limit_type`}>
                                                                                {({ field, form }: FieldProps<FormModel>) => (
                                                                                    <Select
                                                                                        field={field}
                                                                                        form={form}
                                                                                        options={limit_type}
                                                                                        value={limit_type?.filter(
                                                                                            (items) =>
                                                                                                items.value === _.limit_type
                                                                                        )}

                                                                                        onChange={(items) =>
                                                                                            form.setFieldValue(
                                                                                                field.name,
                                                                                                items?.value
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            </Field>
                                                                        </FormItem>

                                                                        {/* expected limit value */}
                                                                        <FormItem
                                                                            label="limit Value"
                                                                            invalid={
                                                                                qtyFeedBack.invalid
                                                                            }
                                                                            errorMessage={
                                                                                qtyFeedBack.errorMessage
                                                                            }

                                                                        >
                                                                            <Field
                                                                                invalid={
                                                                                    qtyFeedBack.invalid
                                                                                }
                                                                                placeholder="Limit Value"
                                                                                name={`benefit_limit[${index}].limit_value`}
                                                                                type="number"
                                                                                component={
                                                                                    Input
                                                                                }
                                                                            />
                                                                        </FormItem>
                                                                        <Button
                                                                            shape="circle"
                                                                            size="sm"
                                                                            icon={
                                                                                <HiMinus />
                                                                            }
                                                                            onClick={() =>
                                                                                remove(
                                                                                    index
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                )
                                                            })
                                                            : null}
                                                        <div>
                                                            <Button
                                                                type="button"
                                                                className="ltr:mr-2 rtl:ml-2"
                                                                onClick={() => {
                                                                    push({
                                                                        name: '',
                                                                        limit_type: '',
                                                                        limit_value: ''

                                                                    })
                                                                }}
                                                            >
                                                                Attach New Benefit
                                                            </Button>
                                                            <Button
                                                                type="submit"
                                                                variant="solid"
                                                            >
                                                                Save list
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </FieldArray>