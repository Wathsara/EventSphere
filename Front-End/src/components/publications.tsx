import { BasicUserInfo } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement, useState, useEffect } from "react";
import {
    Button, Dropdown, Menu, Avatar, Layout, theme, Modal, notification,
    Form, Input, Card, Row, Col, DatePicker, Select, Tooltip
} from 'antd';
import logo from '../images/logo.png';
import userAvatar from '../images/avatar.png';
import {
    CalendarOutlined, EnvironmentOutlined, DeleteOutlined,
    LinkOutlined, StarOutlined, ProfileOutlined, EditOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { createPublication, getPublications, deletePublication, updatePublication } from '../api/publicationsService';
import { Publication } from '../api/publication';
import { default as config } from "../config.json";

const { Header, Content } = Layout;

/**
 * Decoded ID Token Response component Prop types interface.
 */
interface AuthenticationResponsePropsInterface {
    /**
     * Derived Authenticated Response.
     */
    onLogOutClick: () => void;
    derivedResponse?: any;
}

export interface DerivedAuthenticationResponseInterface {
    /**
     * Response from the `getBasicUserInfo()` function from the SDK context.
     */
    authenticateResponse: BasicUserInfo;
    /**
     * ID token split by `.`.
     */
    idToken: string[];
    /**
     * Decoded Header of the ID Token.
     */
    decodedIdTokenHeader: Record<string, unknown>;
    /**
     * Decoded Payload of the ID Token.
     */
    decodedIDTokenPayload: Record<string, unknown>;
}

/**
 * Manage the Publications.
 *
 * @param {AuthenticationResponsePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const Publications: FunctionComponent<AuthenticationResponsePropsInterface> = (
    props: AuthenticationResponsePropsInterface
): ReactElement => {

    const {
        onLogOutClick,
        derivedResponse
    } = props;

    const cardStyle = {
        boxShadow: '0 8px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        margin: '10px',
        overflow: 'hidden',
        transition: 'transform 0.3s ease-in-out',
        ':hover': {
            transform: 'scale(1.03)'
        }
    };

    const contentStyle = {
        padding: '10px'
    };

    const iconStyle = {
        marginRight: '8px',
        color: 'rgba(0, 0, 0, 0.65)'
    };

    const footerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: '1px solid #f0f0f0',
        padding: '10px 20px',
        marginTop: '10px',
        fontSize: '0.9em'
    };

    const rankStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: '#fadb14',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const typeStyle = {
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: '#EC5800',  // A distinct color for the type banner
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '0 8px 8px 0',  // Rounded corners on the right side
        fontSize: '0.85em',
        fontWeight: 'bold'
    };

    const [publications, setPublications] = useState<Publication[]>([]);

    useEffect(() => {
        if (derivedResponse?.accessToken) { // Only run if accessToken is available
            const fetchPublications = async () => {
                const pubs = await getPublications(derivedResponse.accessToken);
                setPublications(pubs);
            };
            fetchPublications();
        }
    }, [derivedResponse?.accessToken]); // Depend on accessToken


    const handleDelete = async (uuid: string) => {
        try {
            await deletePublication(uuid, derivedResponse?.accessToken);
            setPublications(publications.filter(publication => publication.uuid !== uuid));
            openNotification('Success', 'Publication deleted successfully!');
        } catch (error) {
            openDangerNotification('Errir', 'Error deleting publication!');
        }
    };

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [currentPublication, setCurrentPublication] = useState(null);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const showUpdateModal = (publication: Publication) => {
        setCurrentPublication(null)
        setCurrentPublication(publication);
        setIsUpdateModalVisible(true);
    };

    const [createForm] = Form.useForm();

    const handleOk = async (values: Publication) => {
        try {
            const data = await createPublication(values, derivedResponse?.accessToken);
            console.log("Publication created successfully:", data);
            const pubs = await getPublications(derivedResponse?.accessToken);
            setPublications(pubs);
            createForm.resetFields();  // Reset form after submission
            setIsModalVisible(false);
            openNotification('Success', 'Publication created successfully!');
        } catch (error) {
            openDangerNotification('Errir', 'Error creating publication!');
        }
    };

    const handleUpdate = async (values: Publication) => {
        try {
            await updatePublication(currentPublication.uuid, values, derivedResponse?.accessToken);
            const pubs = await getPublications(derivedResponse?.accessToken);
            setPublications(pubs);
            form.resetFields();  // Reset form after submission
            setIsUpdateModalVisible(false);
            openNotification('Success', 'Publication updated successfully!');
        } catch (error) {
            openDangerNotification('Error', 'Error updating publication!');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleMyAccountClick = () => {
        window.open(config.myAccountUrl, '_blank');
    };

    const menu = (
        <Menu>
            <Menu.Item key="myaccount" onClick={handleMyAccountClick}>
                My Account
            </Menu.Item>
            <Menu.Item key="logout" onClick={onLogOutClick}>
                Logout
            </Menu.Item>
        </Menu>
    );
    const [form] = Form.useForm();

    const [searchTerm, setSearchTerm] = useState('');

    // Filtered publications based on search term
    const filteredPublications = publications.filter(pub =>
        pub.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openNotification = (message:String, description: String) => {
        notification.success({
            message: message,
            description: description,
            placement: 'topRight',
            duration: 3, // duration in seconds
            style: { 
                textAlign: "left"
            },
        });
    };

    const openDangerNotification = (message:String, description: String) => {
        notification.success({
            message: message,
            description: description,
            placement: 'topRight',
            duration: 3, // duration in seconds
            style: { 
                textAlign: "left"
            },
        });
    };
    

    // Reset and set form values whenever currentPublication changes
    useEffect(() => {
        if (currentPublication) {
            form.setFieldsValue({
                ...currentPublication,
                conferenceDate: currentPublication.conferenceDate ? moment(currentPublication.conferenceDate) : null,
                paperSubmissionDate: currentPublication.paperSubmissionDate ? moment(currentPublication.paperSubmissionDate) : null
            });
        } else {
            form.resetFields(); // This ensures the form is cleared when currentPublication is null
        }
    }, [currentPublication, form]);
    
    return (
        <>
            <Layout>
                <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Logo" style={{ height: '32px', marginRight: '10px' }} />
                        <span style={{ color: 'white' }}>Conference Sphere</span>
                    </div>
                    <div>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <a onClick={(e) => e.preventDefault()} href="/">
                                <Avatar src={userAvatar} style={{ marginRight: '10px' }} />
                                {derivedResponse?.authenticateResponse?.username} <span className="ant-dropdown-link"></span>
                            </a>
                        </Dropdown>
                    </div>
                </Header>
                <Content style={{ padding: '0 20px' }}>
                    <div
                        style={{
                            background: colorBgContainer,
                            minHeight: 280,
                            padding: 24,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Input
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ margin: '20px', width: '300px' }}
                        />
                        <Button type="primary" onClick={showModal}>
                            + New Publication
                        </Button>
                        <Modal title="Add New Conference" visible={isModalVisible} onCancel={handleCancel} footer={null}>
                            <Form form={createForm} onFinish={handleOk} layout="vertical">
                                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="publicationType" label="publication Type" rules={[{ required: true }]}>
                                    <Select>
                                        <Option value="Conference">Conference</Option>
                                        <Option value="Journal">Journal</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="paperSubmissionDate" label="Paper Submission Date" rules={[{ required: true }]}>
                                    <DatePicker format="YYYY-MM-DD" />
                                </Form.Item>
                                <Form.Item name="conferenceDate" label="Conference Date/Journal Publication Date" rules={[{ required: true }]}>
                                    <DatePicker format="YYYY-MM-DD" />
                                </Form.Item>
                                <Form.Item name="externalLink" label="External Link">
                                    <Input />
                                </Form.Item>
                                <Form.Item name="conferenceRank" label="Rank" >
                                    <Input placeholder="A" />
                                </Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Create
                                </Button>
                            </Form>
                        </Modal>

                        <Row gutter={16} style={{ marginTop: 20 }}>
                            {filteredPublications.map((pub) => (
                                <Col key={pub.uuid} xs={24} sm={12} lg={8}>
                                    <Card
                                        hoverable
                                        style={cardStyle}
                                        cover={
                                            <div style={{ padding: '25px' }}>
                                                <h3><ProfileOutlined style={{ marginRight: '8px' }} />{pub.title}</h3>
                                            </div>

                                        }
                                    >
                                        <div style={contentStyle}>
                                            <p>{pub.description}</p>
                                            <p><EnvironmentOutlined style={iconStyle} />{pub.location}</p>
                                            <p><LinkOutlined style={iconStyle} /><a href={pub.externalLink} target="_blank" rel="noopener noreferrer">More Info</a></p>
                                        </div>
                                        <div style={footerStyle}>
                                            <span><CalendarOutlined /> Submission <br />{pub.paperSubmissionDate} </span>
                                            <span><CalendarOutlined /> Event <br />{pub.conferenceDate} </span>
                                        </div>
                                        <div style={rankStyle}>
                                            <Tooltip title="Conference Rank">
                                                <StarOutlined /> {pub.conferenceRank}
                                            </Tooltip>
                                        </div>
                                        <div style={typeStyle}>
                                            {pub.publicationType}
                                        </div>
                                        <div>
                                            <Button type="primary" ghost icon={<EditOutlined />} onClick={() => showUpdateModal(pub)}>
                                                Update
                                            </Button>
                                            <Button style={{ margin: '10px' }} danger ghost icon={<DeleteOutlined />} onClick={() => handleDelete(pub.uuid)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                    </div>
                </Content>
                <Modal title="Update Conference" visible={isUpdateModalVisible} onCancel={() => setIsUpdateModalVisible(false)} footer={null} >
                    {currentPublication != null && (
                        <Form form={form} onFinish={handleUpdate}
                            initialValues={{
                                ...currentPublication,
                                conferenceDate: currentPublication.conferenceDate ? moment(currentPublication.conferenceDate) : null,
                                paperSubmissionDate: currentPublication.paperSubmissionDate ? moment(currentPublication.paperSubmissionDate) : null
                            }}
                            layout="vertical">
                            <Form.Item name="title" label="Title">
                                <Input />
                            </Form.Item>
                            <Form.Item name="publicationType" label="Type" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="Conference">Conference</Option>
                                    <Option value="Journal">Journal</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="paperSubmissionDate" label="Paper Submission Date" rules={[{ required: true }]}>
                                <DatePicker />
                            </Form.Item>
                            <Form.Item name="conferenceDate" label="Conference Date/Journal Publication Date" rules={[{ required: true }]}>
                                <DatePicker />
                            </Form.Item>
                            <Form.Item name="externalLink" label="External Link">
                                <Input />
                            </Form.Item>
                            <Form.Item name="conferenceRank" label="Rank" >
                                <Input placeholder="A" />
                            </Form.Item>
                            <Button type="primary" htmlType="submit">
                                    Update
                            </Button>
                        </Form>
                    )}
                </Modal>
            </Layout>
        </>
    );
};
