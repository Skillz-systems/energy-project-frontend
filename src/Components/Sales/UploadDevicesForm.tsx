import { useEffect, useState } from "react";
import { z } from "zod";
import { FaPlus } from "react-icons/fa";
import { MdFilterList, MdFilterListOff } from "react-icons/md";
import { HiPlus } from "react-icons/hi2";
import { useApiCall, useGetRequest } from "@/utils/useApiCall";
import { Asterik } from "../InputComponent/Input";
import { LuPlus } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
import { SaleStore } from "@/stores/SaleStore";
import { ProductDetailRow } from "./ProductSaleDisplay";
import SecondaryButton from "../SecondaryButton/SecondaryButton";
import { revalidateStore, truncateTextByWord } from "@/utils/helpers";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";

type DeviceFormSchema = {
  serialNumber: string;
  key: string;
  startingCode: string;
  count: number;
  timeDivider: string;
  restrictedDigitMode: boolean;
  hardwareModel: string;
  firmwareVersion: string;
  isTokenable: boolean;
};

interface DeviceResponse {
  id: string;
  serialNumber: string;
  key: string;
  startingCode: string;
  count: string;
  timeDivider: string;
  restrictedDigitMode: boolean;
  hardwareModel: string;
  firmwareVersion: string;
  isTokenable: boolean;
  saleItemId: string | null;
  createdAt: string;
  updatedAt: string;
}

const defaultFormData = {
  serialNumber: "",
  key: "",
  startingCode: "",
  count: "" as unknown as number,
  timeDivider: "",
  restrictedDigitMode: false,
  hardwareModel: "",
  firmwareVersion: "",
  isTokenable: true,
};

const filterShape = [
  { name: "General Search", value: "search" },
  { name: "Serial Number", value: "serialNumber" },
  { name: "Key", value: "key" },
  { name: "Starting Code", value: "startingCode" },
  { name: "Hardware Model", value: "hardwareModel" },
  { name: "Firmware Version", value: "firmwareVersion" },
];

const UploadDevicesForm = observer(
  ({
    handleClose,
    setDescription,
    currentProductId,
  }: {
    handleClose: () => void;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    currentProductId: string;
  }) => {
    const { apiCall } = useApiCall();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterKey, setFilterKey] = useState<any>("search");
    const [filteredDevices, setFilteredDevices] = useState<
      DeviceResponse[] | null
    >(null);
    const [toggleFilter, setToggleFilter] = useState<boolean>(false);
    const [formData, setFormData] = useState<DeviceFormSchema>(defaultFormData);
    const [loading, setLoading] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
    const [apiError, setApiError] = useState<string | null>(null);
    const [selectedDevices, setSelectedDevices] = useState<string[]>(
      SaleStore.getSelectedDevices(currentProductId) || []
    );
    const [createDevice, setCreateDevice] = useState<boolean>(false);
    const [linkView, setLinkView] = useState<string>("");
    const [prevDescription, setPrevDescription] = useState<string>("");
    const [requiredQuantity, setRequiredQuantity] = useState<number>(0);
    const product = SaleStore.getProductById(currentProductId);
    const [availableDevices, setAvailableDevices] = useState<DeviceResponse[]>(
      []
    );
    const [showLinkedDevices, setShowLinkedDevices] = useState(false);

    const linkedDevices =
      SaleStore.getSelectedTentativeDevices(currentProductId)?.length || 0;

    const { data, mutate } = useGetRequest("/v1/device", true);
    const {
      data: productData,
      isLoading: productLoading,
      error: productError,
    } = useGetRequest(`/v1/products/${product?.productId}`, true);

    // const selectedDeviceIds =
    //   SaleStore.getSelectedTentativeDevices(currentProductId);
    const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>([]);

    const selectedLinkedDevices: DeviceResponse[] = filteredDevices
      ? filteredDevices.filter(
          (device) => selectedDeviceIds && selectedDeviceIds.includes(device.id)
        )
      : [];

    useEffect(() => {
      const initialIds = toJS(
        SaleStore.getSelectedTentativeDevices(currentProductId)
      );
      setSelectedDeviceIds(Array.isArray(initialIds) ? initialIds : []);
    }, [currentProductId]);

    const addDeviceId = (id: string) => {
      setSelectedDeviceIds((prev) => {
        const newIds = Array.from(new Set([...prev, id])); // avoid duplicates
        return newIds;
      });
    };

    const removeDeviceId = (id: string) => {
      setSelectedDeviceIds((prev) => prev.filter((item) => item !== id));
    };

    const requiredDevices: number =
      productData?.inventories?.reduce((sum: number, inventory: any) => {
        const quantity = Number(inventory?.productInventoryQuantity) || 0;
        return sum + quantity;
      }, 0) || 0;

    const filterDevices = async () => {
      const newParams: Record<string, string> = {};
      if (searchTerm.trim()) {
        if (filterKey) newParams[filterKey] = searchTerm;
        else newParams.serialNumber = searchTerm;
      }
      return newParams;
    };

    const fetchDevice = async () => {
      setLoading(true);
      const newParams = await filterDevices();
      try {
        const response = await apiCall({
          endpoint: `/v1/device?${new URLSearchParams(newParams).toString()}`,
          method: "get",
          successMessage: "",
          showToast: false,
        });
        const devices = response.data?.devices || [];
        setFilteredDevices(devices);

        // Get all linked device IDs from sale items
        const linkedDeviceIds = SaleStore.getTransformedSaleItems().flatMap(
          (item) => item.devices || []
        );

        // Set available devices (not selected and not linked)
        const filtered = devices.filter(
          (device: DeviceResponse) =>
            !selectedDevices.includes(device.id) &&
            !linkedDeviceIds.includes(device.id)
        );
        setAvailableDevices(filtered);
      } catch (error) {
        console.error("Error fetching devices:", error);
        setFilteredDevices([]);
        setAvailableDevices([]);
      }
      setLoading(false);
    };

    const handleCreateDevice = async () => {
      setLoading(true);
      try {
        const validatedData = {
          ...formData,
          count: formData.count.toString(),
        };
        await apiCall({
          endpoint: "/v1/device",
          method: "post",
          data: validatedData,
          successMessage: "Device created successfully!",
        });
        await mutate();
        setCreateDevice(false);
        setLinkView("selectDevice");
        setDescription(prevDescription ? prevDescription : "Select Device");
        setFormData(defaultFormData);
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          setFormErrors(error.issues);
        } else {
          const message =
            error?.response?.data?.message || "Internal Server Error";
          setApiError(`Device creation failed: ${message}.`);
        }
      } finally {
        setLoading(false);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      if (name === "searchTerm") {
        setSearchTerm(value);
        e.preventDefault();
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
      }
      setFormErrors((prev) => prev.filter((error) => error.path[0] !== name));
      setApiError(null);
    };

    // const removeLinkedDevice = (deviceId: string) => {
    //   const saleItems = SaleStore.getTransformedSaleItems();
    //   const updatedItems = saleItems.map(item => ({
    //     ...item,
    //     devices: item.devices.filter(id => id !== deviceId)
    //   }));
    //   SaleStore.setSaleItems(updatedItems);
    //   fetchDevice();
    // };

    const isFormFilled = Boolean(formData.serialNumber && formData.key);
    const getFieldError = (fieldName: string) => {
      return formErrors.find((error) => error.path[0] === fieldName)?.message;
    };

    const toggleDeviceSelection = (id: string) => {
      setSelectedDevices((prev) =>
        prev.includes(id) ? prev.filter((sn) => sn !== id) : [...prev, id]
      );
    };

    // const toggleDeviceView = () => {
    //   setShowLinkedDevices(!showLinkedDevices);
    // };

    const linkDevice = () => {
      if (selectedDevices.length !== requiredQuantity) return;
      const validDevices = selectedDevices.map((device) => device.toString());
      SaleStore.addOrUpdateTentativeDevices(currentProductId, validDevices);
      handleCancel();
    };

    const saveForm = () => {
      if (linkedDevices !== requiredDevices) return;
      // Ensure selectedDevices is a valid snapshot
      const validDevices = SaleStore.tentativeDevices.flatMap((t) => t.devices);
      SaleStore.addOrUpdateDevices(currentProductId, validDevices);
      SaleStore.addSaleItem(currentProductId);
      handleClose();
    };

    const handleCancel = () => {
      setSearchTerm("");
      setFilterKey("search");
      setCreateDevice(false);
      setToggleFilter(false);
      setFormData(defaultFormData);
      setFormErrors([]);
      setApiError(null);
      setSelectedDevices([]);
      setFilteredDevices(null);
      setCreateDevice(false);
      setLinkView("");
      setDescription("Link Device(s)");
      setPrevDescription("");
      setRequiredQuantity(0);
    };

    console.log(
      "Tentative Devices:",
      toJS(SaleStore.getSelectedTentativeDevices(currentProductId))
    );

    revalidateStore(SaleStore);

    useEffect(() => {
      if (filteredDevices) {
        const linkedDeviceIds = SaleStore.getTransformedSaleItems().flatMap(
          (item) => item.devices || []
        );

        const available = filteredDevices.filter(
          (device) =>
            !selectedDevices.includes(device.id) &&
            !linkedDeviceIds.includes(device.id)
        );
        setAvailableDevices(available);
      }
    }, [filteredDevices, selectedDevices, SaleStore.getTransformedSaleItems()]);

    console.log("LINKED DEVICES:", availableDevices);

    return (
      <form className="flex flex-col justify-between h-full max-h-[400px] gap-2">
        {createDevice && linkView === "createDevice" ? (
          <div className="space-y-4 max-h-[360px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="serialNumber"
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
                >
                  <Asterik />
                  Serial Number
                </label>
                <input
                  type="text"
                  id="serialNumber"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  required={true}
                  className="w-full px-3 py-2 border rounded-md outline-none transition-colors border-gray-300 focus:border-blue-500"
                  placeholder="Enter serial number"
                />
                {getFieldError("serialNumber") && (
                  <p className="text-xs text-red-500 mt-1">
                    {getFieldError("serialNumber")}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="key"
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
                >
                  <Asterik />
                  Key
                </label>
                <input
                  type="text"
                  id="key"
                  name="key"
                  value={formData.key}
                  onChange={handleInputChange}
                  required={true}
                  className="w-full px-3 py-2 border rounded-md outline-none transition-colors border-gray-300 focus:border-blue-500"
                  placeholder="Enter key"
                />
                {getFieldError("key") && (
                  <p className="text-xs text-red-500 mt-1">
                    {getFieldError("key")}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="startingCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Starting Code
                </label>
                <input
                  type="text"
                  id="startingCode"
                  name="startingCode"
                  value={formData.startingCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md outline-none transition-colors border-gray-300 focus:border-blue-500"
                  placeholder="Enter starting code"
                />
              </div>
              <div>
                <label
                  htmlFor="count"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Count
                </label>
                <input
                  type="number"
                  id="count"
                  name="count"
                  value={formData.count}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md outline-none transition-colors border-gray-300 focus:border-blue-500"
                  placeholder="Enter count"
                  min={0}
                />
              </div>
              <div>
                <label
                  htmlFor="timeDivider"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Time Divider
                </label>
                <input
                  type="text"
                  id="timeDivider"
                  name="timeDivider"
                  value={formData.timeDivider}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md outline-none transition-colors border-gray-300 focus:border-blue-500"
                  placeholder="Enter time divider"
                />
              </div>
              <div>
                <label
                  htmlFor="hardwareModel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hardware Model
                </label>
                <input
                  type="text"
                  id="hardwareModel"
                  name="hardwareModel"
                  value={formData.hardwareModel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md outline-none transition-colors border-gray-300 focus:border-blue-500"
                  placeholder="Enter hardware model"
                />
              </div>
              <div>
                <label
                  htmlFor="firmwareVersion"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Firmware Version
                </label>
                <input
                  type="text"
                  id="firmwareVersion"
                  name="firmwareVersion"
                  value={formData.firmwareVersion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md outline-none transition-colors border-gray-300 focus:border-blue-500"
                  placeholder="Enter firmware version"
                />
              </div>
              <div className="flex items-center w-full gap-4 col-span-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="restrictedDigitMode"
                    checked={formData.restrictedDigitMode}
                    onChange={handleInputChange}
                    className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Restricted Digit Mode
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isTokenable"
                    checked={formData.isTokenable}
                    onChange={handleInputChange}
                    className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Tokenable
                  </span>
                </label>
              </div>
            </div>

            {apiError && (
              <p className="text-sm text-red-500 mt-2">{apiError}</p>
            )}
            <div className="flex items-center justify-between gap-1">
              <SecondaryButton
                variant="secondary"
                children="Cancel"
                onClick={() => {
                  setCreateDevice(false);
                  setLinkView("selectDevice");
                  setDescription(
                    prevDescription ? prevDescription : "Select Device"
                  );
                }}
              />
              <SecondaryButton
                disabled={!isFormFilled}
                loading={loading}
                loadingText="Creating"
                children="Create Device"
                onClick={handleCreateDevice}
              />
            </div>
          </div>
        ) : (
          <>
            <div>
              {linkView === "" ? null : (
                <div className="space-y-2">
                  {toggleFilter && (
                    <div className="flex items-center justify-between w-full gap-1 transition-all">
                      <p className="w-[25%] font-semibold">Set Filter:</p>
                      <select
                        value={filterKey}
                        onChange={(e) => {
                          e.preventDefault();
                          setFilterKey(
                            e.target.value as keyof DeviceFormSchema
                          );
                        }}
                        className="w-[75%] px-3 py-2 border rounded-md outline-none transition-colors border-gray-300 focus:border-blue-500"
                      >
                        {filterShape.map((filter, index) => (
                          <option key={index} value={filter.value}>
                            {filter.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="relative">
                    <input
                      type="text"
                      name="searchTerm"
                      value={searchTerm}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          filterDevices();
                          fetchDevice();
                        }
                      }}
                      onBlur={() => {
                        if (searchTerm) {
                          filterDevices();
                          fetchDevice();
                        }
                      }}
                      placeholder="Search devices..."
                      className="w-full px-4 py-2 pr-10 border rounded-md outline-none transition-colors border-gray-300 focus:border-blue-500"
                    />
                    <div className="flex items-center justify-between absolute right-3 top-1/2 -translate-y-1/2 w-max gap-2 cursor-pointer">
                      <IoIosSearch
                        className="text-textDarkGrey w-5 h-5"
                        title={`${
                          filterKey === "search"
                            ? "Perform Search"
                            : `Search by ${
                                filterShape.find(
                                  (filter) => filter.value === filterKey
                                )?.name
                              }`
                        }`}
                        onClick={() => {
                          filterDevices();
                          fetchDevice();
                        }}
                      />
                      <span
                        title={toggleFilter ? "Reset Filter" : "Apply Filter"}
                        onClick={() => {
                          if (toggleFilter) {
                            setFilterKey("search");
                            setFilteredDevices(null);
                          }
                          setToggleFilter(!toggleFilter);
                        }}
                      >
                        {toggleFilter ? (
                          <MdFilterListOff className="text-errorTwo w-5 h-5" />
                        ) : (
                          <MdFilterList className="text-textDarkGrey w-5 h-5" />
                        )}
                      </span>
                      <span
                        title="Create Device"
                        onClick={() => {
                          setCreateDevice(true);
                          setLinkView("createDevice");
                          setDescription("Create Device");
                        }}
                      >
                        <HiPlus className="text-textDarkGrey w-5 h-5" />
                      </span>
                    </div>
                  </div>
                  {loading && (
                    <p className="text-xs text-textBlack text-center font-medium">
                      Searching...
                    </p>
                  )}
                  {/* {filteredDevices !== null && !loading && (
                    <p className="text-xs text-textBlack text-center font-medium">
                      {availableDevices?.length === 0
                        ? "No available devices found."
                        : `${availableDevices?.length} available device${
                            availableDevices?.length > 1 ? "s" : ""
                          } found.`}
                    </p>
                  )} */}
                  {filteredDevices !== null && !loading && (
                    <p className="text-xs text-textBlack text-center font-medium">
                      {filteredDevices?.length === 0 ? (
                        "No available devices found."
                      ) : (
                        <span className="flex items-center justify-between w-full gap-1">
                          <span
                            className={`cursor-pointer ${
                              showLinkedDevices ? "text-blue-500 underline" : ""
                            }`}
                            onClick={() => setShowLinkedDevices(false)}
                          >
                            {availableDevices?.length === 0 ? "" : "View"}{" "}
                            {availableDevices?.length} available device
                            {availableDevices?.length > 1 ? "s" : ""} found
                          </span>
                          <span
                            className={`cursor-pointer ${
                              !showLinkedDevices
                                ? "text-blue-500 underline"
                                : ""
                            }`}
                            onClick={() => setShowLinkedDevices(true)}
                          >
                            {selectedLinkedDevices?.length === 0 ? "" : "View"}{" "}
                            {filteredDevices &&
                              filteredDevices?.length -
                                availableDevices?.length}{" "}
                            linked device
                            {selectedLinkedDevices?.length > 1 ? "s" : ""}
                          </span>
                        </span>
                      )}
                    </p>
                  )}
                </div>
              )}

              {!loading &&
                filteredDevices === null &&
                (productLoading ? (
                  <p className="text-sm text-textBlack font-medium text-center mt-6">
                    Loading Product Inventories
                  </p>
                ) : productError ? (
                  <p className="text-sm text-textBlack font-medium text-center mt-6">
                    Failed to load product inventories
                  </p>
                ) : linkView === "" ? (
                  <div className="flex flex-col items-center justify-center w-full max-h-[410px] mt-2 gap-1">
                    <p className="text-sm text-textBlack font-medium">
                      {`Link the Product Inventor${
                        productData?.inventories?.length > 1 ? "ies" : "y"
                      } Below`}
                    </p>
                    <div className="w-full max-h-[340px] overflow-y-auto">
                      <div className="flex flex-col gap-2 items-center justify-start w-full pt-2 pr-3">
                        {productData?.inventories?.map(
                          (item: any, index: number) => (
                            <div
                              key={item?.id || index}
                              className="flex items-center justify-between w-full gap-3"
                            >
                              <div className="flex flex-col bg-white gap-2 w-full p-2.5 border-[0.6px] border-strokeGreyThree rounded-[20px]">
                                <ProductDetailRow
                                  label="Inventory Name"
                                  value={
                                    truncateTextByWord(item?.name, 26) || ""
                                  }
                                  title={item?.name || ""}
                                />
                                <ProductDetailRow
                                  label="Manufacturer Name"
                                  value={item?.manufacturerName || ""}
                                />
                                <ProductDetailRow
                                  label="Inventory Status"
                                  value={item?.status || ""}
                                />
                                <ProductDetailRow
                                  label="Quantity"
                                  value={item?.productInventoryQuantity || ""}
                                />
                              </div>
                              <div className="flex items-center justify-center p-0.5 bg-slate-200 rounded-full border-[0.6px] border-strokeGreyTwo cursor-pointer">
                                <LuPlus
                                  className="text-textDarkGrey w-4 h-4"
                                  title="Link Device"
                                  onClick={() => {
                                    setLinkView("selectDevice");
                                    setDescription(
                                      `Select Devices for ${item?.name}`
                                    );
                                    setPrevDescription(
                                      `Select Devices for ${item?.name}`
                                    );
                                    setRequiredQuantity(
                                      item?.productInventoryQuantity
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-center py-4">
                      <SecondaryButton
                        disabled={linkedDevices !== requiredDevices}
                        children={
                          linkedDevices === requiredDevices
                            ? `Save Linked Device${
                                requiredDevices > 1 ? "s" : ""
                              }`
                            : `Saved ${linkedDevices} of ${requiredDevices} Linked Device${
                                requiredDevices > 1 ? "s" : ""
                              } `
                        }
                        onClick={saveForm}
                      />
                    </div>
                  </div>
                ) : null)}

              {linkView === "" ? null : filteredDevices === null ||
                filteredDevices?.length === 0 ? null : (
                <div className="overflow-auto max-h-[220px] border border-strokeGreyTwo rounded-md bg-white mt-2">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="text-sm p-3 text-left border-b border-gray-300 w-full whitespace-nowrap">
                          S/N
                        </th>
                        <th className="text-sm p-3 text-left border-b border-gray-300 w-full whitespace-nowrap">
                          Key
                        </th>
                        <th className="text-sm p-3 text-left border-b border-gray-300 w-full whitespace-nowrap">
                          Hardware Model
                        </th>
                        <th className="text-sm p-3 text-left border-b border-gray-300 w-full whitespace-nowrap">
                          Firmware Version
                        </th>
                      </tr>
                    </thead>
                    {/* <tbody>
                      {availableDevices?.map((device) => (
                        <tr
                          key={device.serialNumber}
                          onClick={() => toggleDeviceSelection(device.id)}
                          className={`border-b border-gray-200 cursor-pointer ${
                            selectedDevices.includes(device.id)
                              ? "bg-[#E3FAD6]"
                              : "hover:bg-[#E3FAD6]"
                          }`}
                        >
                          <td className="text-sm p-3 whitespace-nowrap">
                            {device.serialNumber}
                          </td>
                          <td className="text-sm p-3 whitespace-nowrap">
                            {device.key}
                          </td>
                          <td className="text-sm p-3 whitespace-nowrap">
                            {device.hardwareModel}
                          </td>
                          <td className="text-sm p-3 whitespace-nowrap">
                            {device.firmwareVersion}
                          </td>
                        </tr>
                      ))}
                    </tbody> */}
                    <tbody>
                      {showLinkedDevices
                        ? selectedLinkedDevices?.map((device) => (
                            <tr
                              key={device.serialNumber}
                              onClick={() => {
                                toggleDeviceSelection(device.id);
                                removeDeviceId(device.id);
                              }}
                              className="border-b border-gray-200 cursor-pointer hover:bg-red-100"
                            >
                              <td className="text-sm p-3 whitespace-nowrap">
                                {device.serialNumber}
                              </td>
                              <td className="text-sm p-3 whitespace-nowrap">
                                {device.key}
                              </td>
                              <td className="text-sm p-3 whitespace-nowrap">
                                {device.hardwareModel}
                              </td>
                              <td className="text-sm p-3 whitespace-nowrap">
                                {device.firmwareVersion}
                              </td>
                            </tr>
                          ))
                        : availableDevices?.map((device) => (
                            <tr
                              key={device.serialNumber}
                              onClick={() => {
                                if (
                                  selectedDevices.length === requiredQuantity
                                ) {
                                  return;
                                } else {
                                  addDeviceId(device.id);
                                  toggleDeviceSelection(device.id);
                                }
                              }}
                              className={`border-b border-gray-200 cursor-pointer ${
                                selectedDevices.includes(device.id)
                                  ? "bg-[#E3FAD6]"
                                  : "hover:bg-[#E3FAD6]"
                              }`}
                            >
                              <td className="text-sm p-3 whitespace-nowrap">
                                {device.serialNumber}
                              </td>
                              <td className="text-sm p-3 whitespace-nowrap">
                                {device.key}
                              </td>
                              <td className="text-sm p-3 whitespace-nowrap">
                                {device.hardwareModel}
                              </td>
                              <td className="text-sm p-3 whitespace-nowrap">
                                {device.firmwareVersion}
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                </div>
              )}

              {linkView === ""
                ? null
                : data?.length === 0 && (
                    <div className="text-center pt-2">
                      <p className="mb-2">No devices available.</p>
                      <button
                        type="button"
                        className="px-4 py-2 bg-success hover:bg-green-500 text-white rounded-md transition-colors flex items-center justify-center mx-auto"
                        onClick={() => {
                          setCreateDevice(true);
                          setLinkView("createDevice");
                          setDescription("Create Device");
                        }}
                      >
                        <FaPlus className="mr-2" />
                        Create Device
                      </button>
                    </div>
                  )}
            </div>

            {linkView === "" ? null : (
              <div className="flex flex-col w-full gap-1 px-5 pb-4 mt-4 absolute bottom-0 left-0">
                <p className="text-sm text-textBlack font-medium">
                  {`Selected ${selectedDevices?.length} device${
                    requiredQuantity > 1 ? "s" : ""
                  } out of the required ${requiredQuantity}.`}
                </p>
                <div className="flex items-center justify-between gap-1">
                  <SecondaryButton
                    variant="secondary"
                    children="Back"
                    onClick={handleCancel}
                  />
                  <SecondaryButton
                    disabled={selectedDevices.length !== requiredQuantity}
                    children={`Link Device${requiredQuantity > 1 ? "s" : ""}`}
                    onClick={linkDevice}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </form>
    );
  }
);

export default UploadDevicesForm;
