const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const loginUsers = async (email: string, password: string) => {
    try {
        const res = await fetch(`${BASE_URL}/auth/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to login");
        }

        return {
            success: true,
            data
        };

    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: error.message || "Something went wrong"
        };
    }
};


export const signupUsers = async (name: string, email: string, password: string) => {
    try {
        const res = await fetch(`${BASE_URL}/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            }),
            credentials: "include"
        })
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to signup");
        }

        return {
            success: true,
            data
        };
    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: error.message || "Something went wrong"
        };
    }
}

export const getProfile = async () => {
    try {
        const res = await fetch(`${BASE_URL}/auth/profile`, {
            method: "GET",
            credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed");
        }

        return { success: true, data: data.data };

    } catch (error: any) {
        console.log(error);
        return { success: false };
    }
};

export const logoutUser = async () => {
    try {
        const res = await fetch(`${BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: "include"
        })
        if (res.ok) {
            const data = await res.json();
            return { success: true, data: data }
        }
        else {
            return { success: false, data: null }
        }
    }
    catch (error) {
        console.log(error);
        return { success: false, data: null };
    }
}

export const createItem = async (title: string, description: string, status: "PENDING" | "COMPLETED") => {
    try {
        const res = await fetch(`${BASE_URL}/items`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description,
                status
            })
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Failed to create item");
        }

        const item = result.data;

        const transformedItem = {
            id: item.id,
            title: item.title,
            description: item.description,
            date: new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            }),
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        };

        return { success: true, data: transformedItem };

    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: error.message || "Something went wrong"
        };
    }
};


export const getItems = async () => {
    try {
        const res = await fetch(`${BASE_URL}/items`, {
            method: "GET",
            credentials: "include"
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Failed to fetch items");
        }

        const transformedItems = result.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            date: new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            }),
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }));

        return {
            success: true,
            data: transformedItems
        };

    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: error.message || "Something went wrong"
        };
    }
};


export const deleteItem = async (id: number) => {
    try {
        const res = await fetch(`${BASE_URL}/items/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Failed to delete item");
        }

        return { success: true, data: result.data };

    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: error.message || "Something went wrong"
        };
    }
};


export const updateItem = async (id: number, status: string) => {
    try {
        const res = await fetch(`${BASE_URL}/items/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: status
            })
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Failed to update item");
        }

        const item = result.data;
        const transformedItem = {
            id: item.id,
            title: item.title,
            description: item.description,
            date: new Date(item.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            }),
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        };

        return { success: true, data: transformedItem };

    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: error.message || "Something went wrong"
        };
    }
};

export const updateUsers = async (name: string, email: string) => {
    try {
        const res = await fetch(`${BASE_URL}/auth/profile`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email
            })
        })
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Failed to update user");
        }
        return { success: true, data: data.data };
    }
    catch (error: any) {
        console.log(error);
        return { success: false, message: error.message || "Something went wrong" };
    }
}

export const updateSettings = async (data: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    weeklyDigest?: boolean;
}) => {
    try {
        const res = await fetch(`${BASE_URL}/settings`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.message || "Failed to update settings");
        }

        return { success: true, data: result.user };
    } catch (error: any) {
        console.log(error);
        return { success: false, message: error.message || "Something went wrong" };
    }
};

export const getSettings = async () => {
    try {
        const res = await fetch(`${BASE_URL}/settings`, {
            method: "GET",
            credentials: "include"
        })
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Failed to get settings");
        }
        return { success: true, data: data.user };
    }
    catch (error: any) {
        console.log(error);
        return { success: false, message: error.message || "Something went wrong" };
    }
}

export const forgotPassword = async (email: string) => {
    try {
        const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to send reset email");
        }

        return {
            success: true,
            data
        };

    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: error.message || "Something went wrong"
        };
    }
};

export const resetPassword = async (token: string, password: string) => {
    try {
        const res = await fetch(`${BASE_URL}/auth/reset-password/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to reset password");
        }

        return {
            success: true,
            data
        };

    } catch (error: any) {
        console.log(error);
        return {
            success: false,
            message: error.message || "Something went wrong"
        };
    }
};