export const FULFILLMENT_STATUS = {
	PENDING: 'pending',
	FULFILLED: 'fulfilled',
} as const;

/** An order is locked (done) once it's no longer pending fulfillment. */
export const isOrderLocked = (order: { fulfillment_status: string }): boolean =>
	order.fulfillment_status !== FULFILLMENT_STATUS.PENDING;
