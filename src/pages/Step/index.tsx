import classNames from "../../utils/classNames";
import { CreditCard, ExchangeAlt, LayerGroup } from "../../components/FontawesomeIcon";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step9 from "./components/Step9";
import { useState } from "react";

export enum StepE {
  WRAPPER_NATIVE_TOKEN = 1,
  APPROVE_WRAPPER_NATIVE_TOKEN = 2,
  ALL = 9,
}

const navigation = [
  {
    id: StepE.WRAPPER_NATIVE_TOKEN,
    name: '母币兑换',
    href: '#',
    icon: ExchangeAlt,
    current: false,
    component: Step1
  },
  {
    id: StepE.APPROVE_WRAPPER_NATIVE_TOKEN,
    name: '授权W母币',
    href: '#',
    icon: CreditCard,
    current: false,
    component: Step2
  },
  {
    id: StepE.ALL,
    name: '参考布局',
    href: '#',
    icon: LayerGroup,
    current: false,
    component: Step9
  },
]

export default function Step() {

  const [step, setStep] = useState<StepE>(StepE.WRAPPER_NATIVE_TOKEN)

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-5 p-8">
      <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
        <nav className="space-y-1">
          {navigation.map((item) => (
            <a
              key={item.id}
              className={classNames(
                item.current
                  ? 'bg-gray-50 text-indigo-700 hover:text-indigo-700 hover:bg-white'
                  : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50',
                'group rounded-md px-3 py-2 flex items-center text-sm font-medium'
              )}
              aria-current={item.current ? 'page' : undefined}
              onClick={() => {
                item.current = true
                setStep(item.id)
              }}
            >
              <item.icon
                className={classNames(
                  item.current
                    ? 'text-indigo-500 group-hover:text-indigo-500'
                    : 'text-gray-400 group-hover:text-gray-500',
                  'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
        {
          step === StepE.WRAPPER_NATIVE_TOKEN
            ? <Step1 />
            : step === StepE.APPROVE_WRAPPER_NATIVE_TOKEN
              ? <Step2 />
              : step === StepE.ALL
                ? <Step9 />
                : <></>
        }
      </div>
    </div>
  )
}
